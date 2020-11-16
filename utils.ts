import { PGTransactionEnum, ResponseOptions } from './types';

export const PGTransaction: PGTransactionEnum = {
  begin: 'BEGIN',
  commit: 'COMMIT',
  rollback: 'ROLLBACK',
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export function response(statusCode: number = 200, options: ResponseOptions) {
  const { body = {}, ...rest } = options;
  return {
    statusCode,
    headers,
    body: body ? JSON.stringify(body) : {},
    ...rest,
  };
}
