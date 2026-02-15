import type { Response } from 'express';

export type BaseResponse = {
  statusCode: number;
  message: string;
};

export type ResponseSuccess<T> = BaseResponse & {
  success: true;
  data?: T | undefined;
};

export type ResponseFail<T> = BaseResponse & {
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

export type UnknownResponse<TData, TErrors> =
  | ResponseSuccess<TData>
  | ResponseFail<TErrors>;
