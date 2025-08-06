import { ValidationError } from '@nestjs/common';
import { parseErrors } from 'src/utils/validation';

export enum ErrorCode {
  SERVER_ERROR = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
}

export enum ErrorType {
  DATA = 'DATA',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export class ServerError extends Error {
  name: string;
  code: ErrorCode;
  type: ErrorType;

  trace: string | undefined;
  reason: string | undefined;

  constructor(
    message: string,
    opts?: {
      name?: string;
      type?: ErrorType;
      trace?: string;
      reason?: string;
      code?: ErrorCode;
    },
  ) {
    super(message);

    this.name = opts?.name ?? 'ServerError';
    this.code = opts?.code ?? ErrorCode.SERVER_ERROR;
    this.type = opts?.type ?? ErrorType.UNKNOWN;
    this.trace = opts?.trace;
    this.reason = opts?.reason;
  }

  getStatusCode(): number {
    switch (this.code) {
      case ErrorCode.SERVER_ERROR:
        return 500;
      case ErrorCode.NOT_FOUND:
        return 404;
      case ErrorCode.UNAUTHORIZED:
        return 401;
      case ErrorCode.BAD_REQUEST:
        return 400;
      default:
        return 500;
    }
  }
}

export class NotFoundError extends ServerError {
  constructor(entity: string) {
    super(`Not found: ${entity}`, {
      code: ErrorCode.NOT_FOUND,
      type: ErrorType.VALIDATION,
      name: 'NotFoundError',
    });
  }
}

export class InvalidRequestError extends ServerError {
  constructor(validationErrors: ValidationError[]) {
    super('Invalid request: ' + parseErrors(validationErrors), {
      code: ErrorCode.BAD_REQUEST,
      type: ErrorType.VALIDATION,
      name: 'InvalidRequestError',
    });
  }
}
