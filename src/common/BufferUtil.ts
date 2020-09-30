export class BufferUtil {
  public static fromHex(source: string): Uint8Array {
    const data = source.match(/.{1,2}/g)!.map((x) => parseInt(x, 16));
    return new Uint8Array(data);
  }
}
