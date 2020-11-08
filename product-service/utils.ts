import { PGTransactionEnum } from './types';

export const PGTransaction: PGTransactionEnum = {
  begin: 'BEGIN',
  commit: 'COMMIT',
  rollback: 'ROLLBACK',
};
