export interface ReadableFile {
  select(start: number, end: number): Uint8Array;
  fileName(): string;
}
