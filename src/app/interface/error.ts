export type ErrorSourceType = {
  path: string | number;
  message: string;
  errorMessage: string;
}[];

export interface TGenericErrorResponse {
  message: string;
  statusCode: number;
  errorMessage: string;
}
