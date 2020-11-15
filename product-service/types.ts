export type DbOptions = {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
  ssl: {
    rejectUnauthorized: boolean, // to avoid warring in this example
  },
  connectionTimeoutMillis: number,  // time in millisecond for termination of the database query
};

export type PGTransactionEnum = {
  begin: string,
  commit: string,
  rollback: string,
};
