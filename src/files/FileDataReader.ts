export type FileDataReadResult = {
  be: number;
  le: number;
  index: number;
};

export interface FileData {
  peak(length: number): Uint8Array;
  consume(length: number): Uint8Array;
  resetCursor(): FileData;
  fileName(): string;
}

export class FileDataReader implements FileData {
  private readonly file: File;

  private readonly buffer: ArrayBuffer;

  private cursor = 0;

  public constructor(file: File, dataView: ArrayBuffer) {
    this.file = file;
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

  public fileName(): string {
    return this.file.name;
  }

  public lastModified(): Date {
    return new Date(this.file.lastModified);
  }

  public size(): number {
    return this.file.size;
  }
}
