import { ReadableFile } from "./types";

export type FileDataReadResult = {
  be: number;
  le: number;
  index: number;
};

export class FileDataReader implements ReadableFile {
  private readonly file: File;

  private readonly buffer: Uint8Array;

  public constructor(file: File, buffer: Uint8Array) {
    this.file = file;
    this.buffer = buffer;
  }

  public select(start: number, end: number): Uint8Array {
    if (start < 0 || end <= start || end > this.buffer.length) {
      throw Error("Illegal arguments");
    }

    return this.buffer.subarray(start, end);
  }

  public fileName(): string {
    return this.file.name;
  }
}
