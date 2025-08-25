import { ServerError } from './errors';

export type ControllerResponse<T> = SuccessResponse<T> | FailedResponse;

export type SuccessStatusCode = 200 | 201;
export type ErrorStatusCode = 400 | 401 | 404 | 500;
export interface SuccessResponse<T> {
  data: T;
  statusCode: SuccessStatusCode;
  isSuccess: true;
}

export interface FailedResponse {
  error: string;
  reason?: string;
  statusCode: ErrorStatusCode;
  isSuccess: false;
}

export class ServerResponse {
  static success<T>(data: T, code?: SuccessStatusCode): ControllerResponse<T> {
    return { data, isSuccess: true, statusCode: code ?? 200 };
  }

  static failure<T extends ServerError>(error: T): ControllerResponse<never> {
    return {
      error: error.message,
      reason: error.reason,
      statusCode: error.getStatusCode(),
      isSuccess: false,
    };
  }
}
