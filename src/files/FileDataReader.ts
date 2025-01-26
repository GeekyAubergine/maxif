export type FileDataReadResult = {
  be: number;
  le: number;
  index: number;
};

export class DataViewWithCursor {
  private readonly buffer: DataView;

  private cursor = 0;

  public constructor(dataView: DataView) {
    this.buffer = dataView;
  }

  public peakUint8(): number {
    return this.buffer.getUint8(this.cursor);
  }

  public peakUint16(le: boolean = false): number {
    return this.buffer.getUint16(this.cursor, le);
  }

  public peakUint32(le: boolean = false): number {
    return this.buffer.getUint32(this.cursor, le);
  }

  public peakUint64(le: boolean = false): bigint {
    return this.buffer.getBigUint64(this.cursor, le);
  }

  public consumeUint8(): number {
    const value = this.peakUint8();
    this.cursor += 1;
    return value;
  }

  public consumeUint16(le: boolean = false): number {
    const value = this.peakUint16(le);
    this.cursor += 2;
    return value;
  }

  public consumeUint32(le: boolean = false): number {
    const value = this.peakUint32(le);
    this.cursor += 4;
    return value;
  }

  public consumeUint64(le: boolean = false): bigint {
    const value = this.peakUint64(le);
    this.cursor += 8;
    return value;
  }

  public skip(length: number): DataViewWithCursor {
    this.cursor += length;
    return this;
  }

  public resetCursor(): DataViewWithCursor {
    this.cursor = 0;
    return this;
  }
}
