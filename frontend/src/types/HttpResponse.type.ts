export interface HttpResponse {
  statusCode: number;
  message: string;
  data?: { [key: string]: any };
}
