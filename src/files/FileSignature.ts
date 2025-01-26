type FileSignatureValue =
  | {
      type: "number";
      number: number;
    }
  | {
      type: "wildcard";
    };

export type FileSignatureMatch = {
  readonly name: string;
  readonly relevantBytes: number[];
  readonly signatureAsString: string;
};

export type FileSignatureMatchResult = FileSignatureMatch | false;

export class FileSignature {
  readonly signatureAsString: string;

  readonly offset: number;

  readonly name: string;

  private readonly fileSignature: FileSignatureValue[];

  private static FILE_SIGNATURES: FileSignature[] = [];

  static findSignature(buffer: ArrayBuffer): FileSignatureMatchResult {
    let bestMatch: FileSignatureMatch | false = false;

    for (const signature of FileSignature.FILE_SIGNATURES) {
      const match = signature.matches(buffer);

      if (match) {
        if (
          bestMatch === false ||
          bestMatch.relevantBytes.length < match.relevantBytes.length
        ) {
          bestMatch = match;
        }
      }
    }

    return bestMatch;
  }

  public constructor(signatureAsString: string, offset = 0, name: string) {
    this.signatureAsString = signatureAsString;
    this.offset = offset;
    this.name = name;

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

      FileSignature.FILE_SIGNATURES.push(this);
    }
  }

  /**
   * Returns the signature as a string.
   */
  public toString(): string {
    return this.signatureAsString;
  }

  public matches(buffer: ArrayBuffer): FileSignatureMatch | false {
    const data = new Uint8Array(
      buffer.slice(this.offset, this.offset + this.fileSignature.length),
    );

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

    return {
      name: this.name,
      relevantBytes,
      signatureAsString: this.signatureAsString,
    };
  }
}

// Order taken from https://en.wikipedia.org/wiki/List_of_file_signatures

export const FILE_SIGANTURE_SCRIPT_FILE = new FileSignature(
  "23 21",
  0,
  "Script File",
);

export const FILE_SIGNATURE_GIF = new FileSignature(
  "47 49 46 38 37 61",
  0,
  "GIF",
);

export const FILE_SIGNATURE_GIF_2 = new FileSignature(
  "47 49 46 38 39 61",
  0,
  "GIF",
);

export const FILE_SIGNATURE_TIFF = new FileSignature("4D 4D 00 2A", 0, "TIFF");

export const FILE_SIGNATURE_BIG_TIFF = new FileSignature(
  "4D 4D 00 2B",
  0,
  "Big TIFF",
);

export const FILE_SIGNATURE_CR2 = new FileSignature(
  "49 49 2A 00 10 00 00 00  43 52",
  0,
  "CR2",
);

export const FILE_SIGNATURE_KODAK_CINEON_IMAGE = new FileSignature(
  "80 2A 5F D7",
  0,
  "Kodak Cineon Image",
);

export const FILE_SIGNATURE_ROB_NORTHEN_COMPRESSION_V1 = new FileSignature(
  "52 4E 43 01",
  0,
  "Rob Northen Compression V1",
);

export const FILE_SIGNATURE_ROB_NORTHEN_COMPRESSION_V2 = new FileSignature(
  "52 4E 43 02",
  0,
  "Rob Northen Compression V2",
);

export const FILE_SIGNATURE_ASCII_ANSI_IMGE = new FileSignature(
  "4E 55 52 55 49 4D 47",
  0,
  "nuru ASCII/ANSI Image",
);

export const FILE_SIGNATURE_ASCII_ANSI_IMGE_2 = new FileSignature(
  "4E 55 52 55 50 41 4C",
  0,
  "nuru ASCII/ANSI Image",
);

export const FILE_SIGNATURE_SMPTE_DPX_IMAGE = new FileSignature(
  "53 44 50 58",
  0,
  "SMPTE DPX Image",
);

export const FILE_SIGNATURE_OPENEXR_IMAGE = new FileSignature(
  "76 2F 31 01",
  0,
  "OpenEXR Image",
);

export const FILE_SIGNATURE_BETTER_PORTABLE_GRAPHICS = new FileSignature(
  "42 50 47 FB",
  0,
  "Better Portable Graphics",
);

export const FILE_SIGNATURE_JEPG_BASIC_1 = new FileSignature(
  "FF D8 FF DB",
  0,
  "JPEG",
);

export const FILE_SIGNATURE_JEPG_BASIC_2 = new FileSignature(
  "FF D8 FF EE",
  0,
  "JPEG",
);

export const FILE_SIGNATURE_JEPG_UNKOWN = new FileSignature(
  "FF D8 FF E0",
  0,
  "JPEG. Possibly JFIF or Exif",
);

export const FILE_SIGNATURE_JEPG_JFIF = new FileSignature(
  "FF D8 FF E0 00 10 4A 46 49 46 00 01",
  0,
  "JPEG. JFIF",
);

export const FILE_SIGNATURE_JEPG_EXIF = new FileSignature(
  "FF D8 FF E1 ?? ?? 45 78 69 66 00 00",
  0,
  "JPEG. Exif",
);

export const FILE_SIGNATURE_JPEG_2000_1 = new FileSignature(
  "00 00 00 0C 6A 50 20 20 0D 0A 87 0A",
  0,
  "JPEG 2000",
);

export const FILE_SIGNATURE_JPEG_2000_2 = new FileSignature(
  "FF 4F FF 51",
  0,
  "JPEG 2000",
);

export const FILE_SIGNATURE_AIFF = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 41 49 46 46",
  0,
  "AIFF",
);

export const FILE_SIGNATURE_PNG = new FileSignature(
  "89 50 4E 47 0D 0A 1A 0A",
  0,
  "PNG",
);

export const FILE_SIGNATURE_PDF = new FileSignature("25 50 44 46 2D", 0, "PDF");

export const FILE_SIGNATURE_PHOTOSHOP = new FileSignature(
  "38 42 50 53",
  0,
  "Adobe Photoshop",
);

export const FILE_SIGNATURE_WAV = new FileSignature(
  "52 49 46 46 ?? ?? ?? ?? 57 41 56 45",
  0,
  "Waveform Audio File",
);

export const FILE_SIGNATURE_AVI = new FileSignature(
  "52 49 46 46 ?? ?? ?? ??  41 56 49 20",
  0,
  "Audio Video Interleave",
);

export const FILE_SIGNATURE_MPEG_1_1 = new FileSignature(
  "FF FB",
  0,
  "MPEG-1 Layer 3",
);

export const FILE_SIGNATURE_MPEG_1_2 = new FileSignature(
  "FF F3",
  0,
  "MPEG-1 Layer 3",
);

export const FILE_SIGNATURE_MPEG_1_3 = new FileSignature(
  "FF F2",
  0,
  "MPEG-1 Layer 3",
);

export const FILE_SIGNATURE_MP3 = new FileSignature("49 44 33", 0, "MP3");

export const FILE_SIGNATURE_BITMAP = new FileSignature("42 4D", 0, "Bitmap");

export const FILE_SIGNATURE_FLAC = new FileSignature("66 4C 61 43", 0, "FLAC");

export const FILE_SIGNATURE_MIDI = new FileSignature("4D 54 68 64", 0, "MIDI");

export const FILE_SIGNATURE_COMPOUND_FILE_BINARY = new FileSignature(
  "D0 CF 11 E0 A1 B1 1A E1",
  0,
  "Compound File Binary used by Microsoft",
);

export const FILE_SIGNATURE_FLIF = new FileSignature("46 4C 49 46", 0, "FLIF");

export const FILE_SIGNATURE_WEBP = new FileSignature(
  "52 49 46 46 ?? ?? ?? ?? 57 45 42 50",
  0,
  "WebP",
);

export const FILE_SIGNATURE_MPEG_2_PART_1 = new FileSignature(
  "47",
  0,
  "MPEG-2 Part 1",
);

export const FILE_SIGNATURE_MPEG_1_PART_1 = new FileSignature(
  "00 00 01 BA",
  0,
  "MPEG-1 Part 1 and MPEG-2 Part 1",
);

export const FILE_SIGNATURE_MPEG_VIDEO = new FileSignature(
  "00 00 01 B3",
  0,
  "MPEG-1/MPEG-2 Video",
);

export const FILE_SIGNATURE_MPEG_4_VIDEO_ISO = new FileSignature(
  "66 74 79 70 69 73 6F 6D",
  4,
  "MPEG-4 Video ISO",
);

export const FILE_SIGNATURE_MPEG_4_VIDEO = new FileSignature(
  "66 74 79 70 4D 53 4E 56",
  4,
  "MPEG-4 Video",
);

export const FILE_SIGNATURE_ROBLOX_PLACE = new FileSignature(
  "3C 72 6F 62 6C 6F 78 21",
  0,
  "Roblox Place",
);

export const FILE_SIGNATURE_JPEG_XL_1 = new FileSignature(
  "00 00 00 0C 4A 58 4C 20 0D 0A 87 0A",
  0,
  "JPEG XL",
);

export const FILE_SIGNATURE_JPEG_XL_2 = new FileSignature(
  "FF 0A",
  0,
  "JPEG XL",
);

export const FILE_SIGNATURE_DSS_V2 = new FileSignature(
  "02 64 73 73",
  0,
  "DSS V2",
);

export const FILE_SIGNATURE_DSS_V3 = new FileSignature(
  "03 64 73 73",
  0,
  "DSS V3",
);
