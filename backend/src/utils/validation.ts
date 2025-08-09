import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import {
  ErrorCode,
  ErrorType,
  InvalidRequestError,
  ServerError,
  UnauthorizedError,
} from 'src/types';

/**
 * Intended to be used on controllers ONLY
 */
export async function validateBody<T extends object>(
  dtoClass: ClassConstructor<T>,
  body: object,
): Promise<T> {
  try {
    const dto = plainToClass(dtoClass, body);

    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      throw new InvalidRequestError(validationErrors);
    }

    return dto;
  } catch (e) {
    if (e instanceof InvalidRequestError) {
      throw e;
    }

    throw new ServerError('Unable to validate request body', {
      reason: (e as Error).message,
      code: ErrorCode.BAD_REQUEST,
      type: ErrorType.VALIDATION,
    });
  }
}

export function parseErrors(validateErrors: ValidationError[]): string {
  return validateErrors
    .map((error) => {
      const target = error.property;
      const constraints = Object.values(error.constraints || {}).join(', ');

      return `[${target}] ${constraints}`;
    })
    .join('; ');
}

export function validatePublicRequest(iam: string | undefined): void {
  if (!iam) {
    throw new UnauthorizedError('Missing permissions');
  }

  if (iam !== process.env.IAM_PUBLIC_KEY) {
    throw new UnauthorizedError('Invalid Access Permissions');
  }
}
