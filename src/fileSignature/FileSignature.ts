import { ReadableFile } from "../entities/types";

type MagicNumber =
  | {
      type: "number";
      number: number;
    }
  | {
      type: "wildcard";
    };

export type FileSignatureMatch = {
  fileName: string
  fileSignature: FileSignature;
  start: number;
  end: number;
};

export class FileSignature {
  readonly format: string;

  readonly signatureAsString: string;

  readonly offset: number;

  readonly isLittleEndian: boolean;

  private readonly magicNumbers: MagicNumber[];

  public constructor(
    format: string,
    signatureAsString: string,
    offset = 0,
    isLittleEndian = false,
  ) {
    this.format = format;
    this.signatureAsString = signatureAsString;
    this.offset = offset;
    this.isLittleEndian = isLittleEndian;

    const s = signatureAsString.replace(/\s/g, "");

    this.magicNumbers = [];

    for (let i = 0; i < s.length; i += 2) {
      const sub = s.substr(i, 2);

      if (sub === "??") {
        this.magicNumbers.push({ type: "wildcard" });
        continue;
      }

      if (sub.length !== 2) {
        throw new Error(`Invalid signature format: ${signatureAsString}`);
      }

      this.magicNumbers.push({ type: "number", number: parseInt(sub, 16) });
    }
  }

  /**
   * Returns the signature as a string.
   */
  public toString(): string {
    return this.signatureAsString;
  }

  public matches(readableBuffer: ReadableFile): FileSignatureMatch | false {
    const data = readableBuffer.select(
      0,
      this.offset + this.magicNumbers.length,
    );

    for (let i = 0; i < this.magicNumbers.length; i += 1) {
      const magicNumber = this.magicNumbers[i];

      if (magicNumber.type === "wildcard") {
        continue;
      }

      const byte = data[i];

      if (byte !== magicNumber.number) {
        return false;
      }
    }

    return {
      fileName: readableBuffer.fileName(),
      fileSignature: this,
      start: this.offset,
      end: this.offset + this.magicNumbers.length,
    };
  }
}
