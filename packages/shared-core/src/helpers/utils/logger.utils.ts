export class LoggerUtils {
  public static debug(klass: string, methodName: string, ...args: any): void {
    console.debug(`[${klass}][${methodName}]:`, args);
  }

  public static log(klass: string, methodName: string, ...args: any): void {
    console.log(`[${klass}][${methodName}]:`, args);
  }

  public static error(klass: string, methodName: string, ...args: any): void {
    console.error(`[${klass}][${methodName}]:`, args);
  }

  public static info(klass: string, methodName: string, ...args: any): void {
    console.info(`[${klass}][${methodName}]:`, args);
  }
}
