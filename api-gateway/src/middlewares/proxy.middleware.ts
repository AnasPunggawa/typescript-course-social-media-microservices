import type { NextFunction, Request, Response } from 'express';
import {
  createProxyMiddleware,
  fixRequestBody,
  type Options,
} from 'http-proxy-middleware';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { responseFail } from '@libs/responses/fail.response';

type ProxyMiddlewareParams = {
  target: string;
  service: string;
  pathRewrite?: Record<string, string>;
};

export function proxyMiddleware({
  target,
  service,
  pathRewrite,
}: ProxyMiddlewareParams) {
  const options: Options<Request, Response> = {
    target,
    changeOrigin: true,
    secure: true,
    timeout: 1000 * 5, // 5 seconds
    proxyTimeout: 1000 * 5, // 5 seconds
    on: {
      proxyReq(proxyReq, req) {
        if (req.user) {
          proxyReq.setHeader('X-User-Id', req.user.id);
        }

        const fullTargetURL = target + req.path;

        logInfo(
          `${service} Proxy Request ${req.method} ${req.originalUrl} -> ${fullTargetURL}`,
          'PROXY',
        );

        fixRequestBody(proxyReq, req);
      },
      proxyRes(proxyRes, req) {
        const fullTargetURL = target + req.path;

        logInfo(
          `${service} Proxy Response ${req.method} ${req.originalUrl} -> ${fullTargetURL} [${proxyRes.statusCode}]`,
          'PROXY',
        );
      },
      error(error, _req, res) {
        logError(`${service} Proxy Error`, error, 'PROXY');

        if ('headersSent' in res && !res.headersSent) {
          responseFail({
            res: res as Response,
            statusCode: 502,
            message: 'Bad Gateway',
          });
        }
      },
    },
  };

  return createProxyMiddleware<Request, Response, NextFunction>(
    pathRewrite
      ? {
          ...options,
          pathRewrite(_path, req) {
            const [replace, value]: [string, string] =
              Object.entries(pathRewrite)[0]!;

            return req.originalUrl.replace(replace, value);
          },
        }
      : options,
  );
}
