export type FileDataReadResult = {
  be: number;
  le: number;
  index: number;
};

export interface FileData {
  peak(length: number): Uint8Array;
  consume(length: number): Uint8Array;
  resetCursor(): FileData;
}

export class FileDataReader implements FileData {
  private readonly buffer: ArrayBuffer;

  private cursor = 0;

  public constructor(dataView: ArrayBuffer) {
    this.buffer = dataView;
  }

  public peak(length: number): Uint8Array {
    return new Uint8Array(this.buffer, this.cursor, length);
  }

  public consume(length: number): Uint8Array {
    const buffer = this.peak(length);
    this.cursor += length;

    this.cursor = Math.min(this.cursor, this.buffer.byteLength);

    return buffer;
  }

  public resetCursor(): FileData {
    this.cursor = 0;
    return this
  }
}
