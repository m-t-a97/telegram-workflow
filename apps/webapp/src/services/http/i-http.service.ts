export type IHttpRequestConfig = {
  headers: Record<string, string>;
};

export interface IHttpService {
  get<T>(url: string, options?: IHttpRequestConfig): Promise<T>;
  post<T>(url: string, data: T, options?: IHttpRequestConfig): Promise<any>;
  put<T>(url: string, data: T, options?: IHttpRequestConfig): Promise<any>;
  delete(url: string, options?: IHttpRequestConfig): Promise<any>;
}
