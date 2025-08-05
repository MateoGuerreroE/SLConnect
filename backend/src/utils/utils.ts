import { ErrorType, ServerError } from 'src/types';

export function handleServiceError(
  error: unknown,
  {
    source = 'Unknown',
    message = 'An unexpected error occurred',
  }: { message?: string; source?: string },
): never {
  if (error instanceof ServerError) {
    throw error;
  }

  // This assumes not handled errors come from repo layer
  throw new ServerError(message, {
    name: 'DataError',
    trace: `[Service] ${source}`,
    reason: (error as Error).message,
    type: ErrorType.DATA,
  });
}

export function handleControllerError(error: unknown): never {
  if (error instanceof ServerError) {
    throw error;
  }

  // This should never be executed as all errors should be handled in the service layer
  throw new ServerError('An unexpected error occurred', {
    name: 'ControllerError',
    trace: '[Controller] Unknown',
    reason: (error as Error).message,
    type: ErrorType.UNKNOWN,
  });
}
