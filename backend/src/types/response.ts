import { ServerError } from './errors';

export type ControllerResponse<T> = SuccessResponse<T> | FailedResponse;

type BaseResponse = {
  statusCode?: number;
};

export interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

export interface FailedResponse extends BaseResponse {
  error: string;
  reason?: string;
}

export class ServerResponse {
  static success<T>(data: T, code?: number): ControllerResponse<T> {
    return { data, statusCode: code ?? 200 };
  }

  static failure<T extends ServerError>(error: T): ControllerResponse<never> {
    return {
      error: error.message,
      reason: error.reason,
      statusCode: error.getStatusCode(),
    };
  }
}
