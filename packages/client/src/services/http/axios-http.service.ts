import axios from "axios";

import { IHttpService } from "./i-http.service";

export class AxiosHttpService implements IHttpService {
  private readonly apiUrl = process.env.VUE_APP_API_URL;

  public async get<T>(url: string): Promise<T> {
    return axios.get(`${this.apiUrl}/${url}`).then((response) => response.data);
  }

  public async post<T>(url: string, data: T): Promise<any> {
    return axios
      .post<T>(`${this.apiUrl}/${url}`, data)
      .then((response) => response.data);
  }
}
