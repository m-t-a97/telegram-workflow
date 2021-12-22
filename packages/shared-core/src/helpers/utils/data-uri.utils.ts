export class DataUriUtils {
  public static convertToSVG(svgText: string): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
  }

  public static convertToPNG(buffer: Buffer): string {
    return `data:image/png;base64,${buffer.toString("base64")}`;
  }
}
