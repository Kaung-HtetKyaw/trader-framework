export type QueryError = {
  response: {
    data: {
      errorCode: string;
      errorMessage: string;
    };
  };
};
