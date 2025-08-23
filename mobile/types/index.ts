export type ControllerResponse<T> = SuccessResponse<T> | FailedResponse;

export interface SuccessResponse<T> {
  data: T;
  statusCode: number;
  isSuccess: true;
}

export interface FailedResponse {
  error: string;
  reason?: string;
  statusCode: number;
  isSuccess: false;
}
