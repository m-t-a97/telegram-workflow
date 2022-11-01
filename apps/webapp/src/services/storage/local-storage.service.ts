import localforage from "localforage";

import { LoggerUtils } from "@/shared-core";

export class LocalStorageService {
  public static configure(): void {
    localforage.config({
      name: `${import.meta.env.VITE_PROJECT_NAME}_DB`,
      storeName: `${import.meta.env.VITE_PROJECT_NAME}_Store`,
    });
  }

  public static async getItem<T>(key: string): Promise<T> {
    try {
      return localforage.getItem<T>(key);
    } catch (error) {
      LoggerUtils.error("LocalStorageService", "getItem", error);

      return Promise.reject(error.message);
    }
  }

  public static setItem<T>(key: string, value: T): Promise<any> {
    try {
      return localforage.setItem<T>(key, value);
    } catch (error) {
      LoggerUtils.error("LocalStorageService", "setItem", error);

      return Promise.reject(error.message);
    }
  }

  public static removeItem(key: string): Promise<any> {
    try {
      return localforage.removeItem(key);
    } catch (error) {
      LoggerUtils.error("LocalStorageService", "removeItem", error);

      return Promise.reject(error.message);
    }
  }
}
