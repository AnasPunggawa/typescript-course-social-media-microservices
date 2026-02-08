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

export type ResponseSuccessParams<T> = BaseResponse & {
  res: Response<ResponseSuccess<T>>;
  data?: T;
};

export type ResponseFailParams<T> = BaseResponse & {
  res: Response<ResponseFail<T>>;
  errors?: T;
};
