import { FileData } from "./FileDataReader";

type FileSignatureValue =
  | {
      type: "number";
      number: number;
    }
  | {
      type: "wildcard";
    };

export type FileSignatureMatchResult = {
  readonly relevantBytes: number[];
  readonly signatureAsString: string;
};

export class FileSignature {
  readonly signatureAsString: string;

  readonly offset: number;

  readonly isLittleEndian: boolean;

  private readonly fileSignature: FileSignatureValue[];

  public constructor(
    signatureAsString: string,
    offset = 0,
    isLittleEndian = false,
  ) {
    this.signatureAsString = signatureAsString;
    this.offset = offset;
    this.isLittleEndian = isLittleEndian;

    const s = signatureAsString.replace(/\s/g, "");

    this.fileSignature = [];

    for (let i = 0; i < s.length; i += 2) {
      const sub = s.substring(i, i + 2);

      if (sub.length === 0) {
        break;
      }

      if (sub === "??") {
        this.fileSignature.push({ type: "wildcard" });
        continue;
      }

      if (sub.length !== 2) {
        throw new Error(
          `Invalid signature format: ${signatureAsString}. Next byte at ${i} is not 2 characters long [${sub}]`,
        );
      }

      this.fileSignature.push({ type: "number", number: parseInt(sub, 16) });
    }
  }

  /**
   * Returns the signature as a string.
   */
  public toString(): string {
    return this.signatureAsString;
  }

  public matches(readableBuffer: FileData): FileSignatureMatchResult | false {
    const data = readableBuffer.peak(this.offset + this.fileSignature.length);

    console.log({ data });

    const relevantBytes: number[] = [];

    for (let i = 0; i < this.fileSignature.length; i += 1) {
      const magicNumber = this.fileSignature[i];

      if (magicNumber.type === "wildcard") {
        continue;
      }

      const byte = data[i];

      if (byte !== magicNumber.number) {
        return false;
      }

      relevantBytes.push(i);
    }

    const decoder = new TextDecoder("ISO-8859-1");

    return {
      relevantBytes,
      signatureAsString: this.signatureAsString,
    };
  }
}
