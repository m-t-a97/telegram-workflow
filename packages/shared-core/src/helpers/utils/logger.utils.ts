export class LoggerUtils {
  public static debug(klass: string, methodName: string, ...args: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${klass}][${methodName}]:`, args);
    }
  }

  public static log(klass: string, methodName: string, ...args: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[${klass}][${methodName}]:`, args);
    }
  }

  public static error(klass: string, methodName: string, ...args: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.error(`[${klass}][${methodName}]:`, args);
    }
  }

  public static info(klass: string, methodName: string, ...args: any): void {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[${klass}][${methodName}]:`, args);
    }
  }
}
