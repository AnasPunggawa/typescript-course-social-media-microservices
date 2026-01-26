import type { Response } from 'express';

type BaseResponse = {
  statusCode: number;
  message: string;
};

type ResponseSuccess<T> = BaseResponse & {
  success: true;
  data?: T | undefined;
};

type ResponseFail<T> = BaseResponse & {
  success: false;
  errors?: T | undefined;
};

export type ResponseSuccessParams<T> = {
  res: Response<ResponseSuccess<T>>;
  message: string;
  statusCode: number;
  data?: T;
};

export type ResponseFailParams<T> = {
  res: Response<ResponseFail<T>>;
  message: string;
  statusCode: number;
  errors?: T;
};
