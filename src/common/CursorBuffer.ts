import BigNumber from 'bignumber.js';
const leb = require('leb')

/**
 * A wrapper around byte buffers to perform cursor reading on bytes
 * of different sizes
 *
 */
export default class CursorBuffer {
  public dataView: DataView;
  private readonly littleEndian: boolean;
  private bytePosition: number;

  constructor(typedArray: Uint8Array, littleEndian = true) {
    this.dataView = new DataView(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    this.littleEndian = littleEndian;
    this.bytePosition = 0;
  }

  /**
   * Reads 1 byte
   *
   */
  public read8(): number {
    const value = this.dataView.getUint8(this.bytePosition);
    this.bytePosition += 1;
    return value;
  }

  /**
   * Reads 4 bytes
   *
   */
  public read32(): number {
    const value = this.dataView.getUint32(this.bytePosition, this.littleEndian);
    this.bytePosition += 4;
    return value;
  }

  /**
   * Reads 8 bytes
   *
   *
   */
  public read64(): BigNumber {
    const firstPart = this.read32();
    const secondPart = this.read32();

    const combined = this.littleEndian
      ? secondPart.toString(16) + firstPart.toString(16).padStart(8, '0')
      : firstPart.toString(16) + secondPart.toString(16).padStart(8, '0');

    return new BigNumber(`0x${combined}`, 16);
  }

  public read128(): BigNumber {
    const firstPart = this.read64();
    const secondPart = this.read64();

    const combined = this.littleEndian
      ? secondPart.toString(16) + firstPart.toString(16).padStart(8, '0')
      : firstPart.toString(16) + secondPart.toString(16).padStart(8, '0');

    return new BigNumber(`0x${combined}`, 16);
  }

  public readXBytes(x: number): Uint8Array {
    const startPosition = this.bytePosition + this.dataView.byteOffset;
    const value = new Uint8Array(this.dataView.buffer, startPosition, x);
    this.bytePosition += x;

    return value;
  }

  /**
   * Read bool as 1 byte
   *
   */
  public readBool(): boolean {
    const value = this.dataView.getUint8(this.bytePosition);
    this.bytePosition += 1;
    if(value !== 0 && value !== 1) {
      throw new Error(`bool must be 0 or 1, found ${value}`);
    }
    return value !== 0;
  }

  public readULEB(): BigNumber {
    const startPosition = this.bytePosition + this.dataView.byteOffset;
    const ar: Uint8Array = new Uint8Array(this.dataView.buffer, startPosition, 128)
    const buf = Buffer.from(ar)
    const res: { value: Buffer, nextIndex: number } = leb.decodeUIntBuffer(buf, 0)

    this.bytePosition += res.nextIndex;

    return new BigNumber(`0x${res.value.toString('hex')}`, 16);
  }

  public write(payload: Uint8Array) {
    const buffer = toBuffer(this.dataView.buffer)
    const newBuffer = Buffer.concat([buffer, Buffer.from(payload)]);

    this.dataView = new DataView(
        newBuffer.buffer,
        0,
        newBuffer.length
    );
  }
}

function toBuffer(ab: ArrayBuffer): Buffer {
  const buf: Buffer = Buffer.alloc(ab.byteLength);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
