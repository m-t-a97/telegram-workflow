export interface IHttpService {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: T): Promise<any>;
}
