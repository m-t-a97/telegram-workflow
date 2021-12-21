import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";

import { IHttpService } from "./i-http.service";

export class AxiosHttpService implements IHttpService {
  private readonly apiUrl: string;

  constructor() {
    if (_.isEqual(process.env.NODE_ENV, "production")) {
      this.apiUrl = window.location.origin;
    } else {
      this.apiUrl = process.env.VUE_APP_API_URL;
    }

    console.log("API URL:", this.apiUrl);
  }

  public async get<T>(
    url: string,
    options?: AxiosRequestConfig<any>
  ): Promise<T> {
    return axios
      .get(`${this.apiUrl}/${url}`, options)
      .then((response) => response.data);
  }

  public async post<T>(
    url: string,
    data: T,
    options?: AxiosRequestConfig<any>
  ): Promise<any> {
    return axios
      .post<T>(`${this.apiUrl}/${url}`, data, options)
      .then((response) => response.data);
  }

  public async put<T>(
    url: string,
    data: T,
    options?: AxiosRequestConfig<any>
  ): Promise<any> {
    return axios
      .put<T>(`${this.apiUrl}/${url}`, data, options)
      .then((response) => response.data);
  }

  public async delete(
    url: string,
    options?: AxiosRequestConfig<any>
  ): Promise<any> {
    return axios
      .delete(`${this.apiUrl}/${url}`, options)
      .then((response) => response.data);
  }
}
