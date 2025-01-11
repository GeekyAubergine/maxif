import { ReadableFile } from "../entities/types";
import { findSignatureForReadableBuffer } from "./findFileSignature";

class TestReadableBuffer implements ReadableFile {
  private readonly buffer: Uint8Array;

  public constructor(buffer: Uint8Array) {
    this.buffer = buffer;
  }

  public select(start: number, end: number): Uint8Array {
    return this.buffer.subarray(start, end);
  }

  public fileName(): string {
    return "test";
  }
}

describe("findSignatureForReadableBuffer", () => {
  it("should find a signature", () => {
    const buffer = new TestReadableBuffer(
      new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0x34, 0x23]),
    );

    const match = findSignatureForReadableBuffer(buffer);

    expect(match).toBeTruthy();

    if (!match) {
      throw new Error("match should be truthy");
    }

    expect(match.fileSignature.format).toBe("JPEG");
  });

  it("should not find a signature", () => {
    const reader = new TestReadableBuffer(new Uint8Array([0xff, 0xd9]));

    const match = findSignatureForReadableBuffer(reader);

    expect(match).toBeFalsy();
  });
});
