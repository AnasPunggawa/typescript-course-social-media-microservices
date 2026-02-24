import type { Response } from 'express';

type BaseResponse = {
  statusCode: number;
  message: string;
};

type BaseResponseParams = BaseResponse;

export type ResponseSuccess<T> = Response<
  BaseResponse & {
    success: true;
    data: T | undefined;
  }
>;

export type ResponseFail<T> = Response<
  BaseResponse & {
    success: false;
    errors: T | undefined;
  }
>;

export type ResponseSuccessParams<T> = BaseResponseParams & {
  res: ResponseSuccess<T>;
  data?: T;
};

export type ResponseFailParams<T> = BaseResponseParams & {
  res: ResponseFail<T>;
  errors?: T;
};
