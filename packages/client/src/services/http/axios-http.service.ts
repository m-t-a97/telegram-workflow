import axios from "axios";
import _ from "lodash";

import { IHttpService } from "./i-http.service";

export class AxiosHttpService implements IHttpService {
  private readonly apiUrl: string;

  constructor() {
    if (_.isEqual(process.env.NODE_ENV, "production")) {
      this.apiUrl = !_.isNil(process.env.VUE_APP_HEROKU_APP_NAME)
        ? `https://${process.env.VUE_APP_HEROKU_APP_NAME}.herokuapp.com`
        : process.env.VUE_APP_API_URL;
    } else {
      this.apiUrl = process.env.VUE_APP_API_URL;
    }
  }

  public async get<T>(url: string): Promise<T> {
    return axios.get(`${this.apiUrl}/${url}`).then((response) => response.data);
  }

  public async post<T>(url: string, data: T): Promise<any> {
    return axios
      .post<T>(`${this.apiUrl}/${url}`, data)
      .then((response) => response.data);
  }

  public async put<T>(url: string, data: T): Promise<any> {
    return axios
      .put<T>(`${this.apiUrl}/${url}`, data)
      .then((response) => response.data);
  }

  public async delete(url: string): Promise<any> {
    return axios
      .delete(`${this.apiUrl}/${url}`)
      .then((response) => response.data);
  }
}
