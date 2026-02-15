import type { NextFunction, Request, Response } from 'express';
import {
  createProxyMiddleware,
  fixRequestBody,
  type Options,
} from 'http-proxy-middleware';

import { logError } from '@libs/logger/error.logger';
import { logInfo } from '@libs/logger/info.logger';
import { responseFail } from '@libs/responses/fail.response';

export function proxyMiddleware(
  target: string,
  service: string,
  pathRewrite?: Record<string, string>,
) {
  const options: Options<Request, Response> = {
    target,
    changeOrigin: true,
    secure: true,
    timeout: 1000 * 5, // 5 seconds
    proxyTimeout: 1000 * 5, // 5 seconds
    on: {
      proxyReq(proxyReq, req) {
        const fullTargetURL = target + req.path;

        logInfo(
          `${service} Proxy Request ${req.method} ${req.url} -> ${fullTargetURL}`,
          'PROXY',
        );

        fixRequestBody(proxyReq, req);
      },
      proxyRes(proxyRes, req) {
        const fullTargetURL = target + req.path;

        logInfo(
          `${service} Proxy Response ${req.method} ${req.url} -> ${fullTargetURL} [${proxyRes.statusCode}]`,
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
    pathRewrite ? { ...options, pathRewrite } : options,
  );
}
