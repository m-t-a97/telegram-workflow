export interface IHttpService {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: T): Promise<any>;
  put<T>(url: string, data: T): Promise<any>;
  delete(url: string): Promise<any>;
}
