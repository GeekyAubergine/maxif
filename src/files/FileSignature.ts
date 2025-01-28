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
  readonly signatureOffset: number;
};

export type FileSignatureMatchResult = FileSignatureMatch | false;

export class FileSignature {
  readonly signatureAsString: string;

  readonly offset: number;

  readonly name: string;

  readonly description: string | null;

  private readonly fileSignature: FileSignatureValue[];

  private static FILE_SIGNATURES: FileSignature[] = [];

  static findSignature(buffer: ArrayBuffer): FileSignatureMatchResult {
    let bestMatch: FileSignatureMatch | false = false;

    for (const signature of FileSignature.FILE_SIGNATURES) {
      const match = signature.matches(buffer);

      if (match) {
        console.log({ match, bestMatch });

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

  public constructor(
    signatureAsString: string,
    offset = 0,
    name: string,
    description: string | null = null,
  ) {
    this.signatureAsString = signatureAsString;
    this.offset = offset;
    this.name = name;
    this.description = description;

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

      relevantBytes.push(i + this.offset);
    }

    return {
      name: this.name,
      relevantBytes,
      signatureAsString: this.signatureAsString,
      signatureOffset: this.offset,
    };
  }
}

// Order taken from https://en.wikipedia.org/wiki/List_of_file_signatures

export const FILE_SIGANTURE_SCRIPT_FILE = new FileSignature(
  "23 21",
  0,
  "Script File",
);

export const FILE_SIGNATURE_CLARIS_WORKS = new FileSignature(
  "02 00 5a 57 52 54 00 00 00 00 00 00 00 00 00 00",
  0,
  "Claris Works Document",
);

export const FILE_SIGNATURE_LOTUS_123_V1 = new FileSignature(
  "00 00 02 00 06 04 06 00 08 00 00 00 00 00",
  0,
  "Lotus 1-2-3 speadsheet V1",
);

export const FILE_SIGNATURE_LOTUS_123_V3 = new FileSignature(
  "00 00 1A 00 00 10 04 00 00 00 00 00",
  0,
  "Lotus 1-2-3 speadsheet V3",
);

export const FILE_SIGNATURE_LOTUS_123_V4_5 = new FileSignature(
  "00 00 1A 00 02 10 04 00 00 00 00 00",
  0,
  "Lotus 1-2-3 speadsheet V4 / V5",
);

export const FILE_SIGNATURE_LOTUS_123_V9 = new FileSignature(
  "00 00 1A 00 05 10 04",
  0,
  "Lotus 1-2-3 speadsheet V9",
);

export const FILE_SIGNATURE_AMIGA_HUNK_EXECUTABLE = new FileSignature(
  "00 00 03 F3",
  0,
  "Amiga Hunk Executable",
);

export const FILE_SIGNATURE_QUARK_EXPRESS = new FileSignature(
  "00 00 4D 4D 58 50 52",
  0,
  "Quark Express Document",
);

export const FILE_SIGNATURE_PASSWORD_GORILLA_PASSWORD_DATABASE =
  new FileSignature("50 57 53 33", 0, "Password Gorilla Password Database");

export const FILE_SIGNATURE_LIBCAP_FILE = new FileSignature(
  "A1 B2 C3 D4",
  0,
  "Libcap File",
);

export const FILE_SIGNATURE_LIBCAP_NS_FILE = new FileSignature(
  "A1 B2 3C 4D",
  0,
  "Libcap File (nanosecond resolution)",
);

export const FILE_SIGNATURE_PCAP_FILE = new FileSignature(
  "0A 0D 0D 0A",
  0,
  "PCAP Next Generation Dump File",
);

export const FILE_SIGNATURE_RPM_PACKAGE = new FileSignature(
  "ED AB EE DB",
  0,
  "RedHat Package Manager Package",
);

export const FILE_SIGNATURE_SQLITE_3 = new FileSignature(
  "53 51 4C 69 74 65 20 66 6F 72 6D 61 74 20 33 00",
  0,
  "SQLite 3 Database",
);

export const FILE_SIGNATURE_AMAZON_KINDLE_UPDATE = new FileSignature(
  "53 50 30 31",
  0,
  "Amazon Kindle Update Package",
);

export const FILE_SIGNATURE_INTERNAL_WAD = new FileSignature(
  "49 57 41 44",
  0,
  "Internal WAD",
  "Doom resource file",
);

export const FILE_SIGNATURE_IBM_STORYBOARD_BITMAP = new FileSignature(
  "00",
  0,
  "IBM Storyboard Bitmap",
);

export const FILE_SIGNATURE_PALM_PILOT_DATABASE_DOCUMENT = new FileSignature(
  "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00",
  11,
  "Palm Pilot Database/Document",
);

export const FILE_SIGNATURE_PALM_DESKTOP_CALENDAR_ARCHIVE = new FileSignature(
  "BE BA FE CA",
  0,
  "Palm Desktop Calendar Archive",
);

export const FILE_SIGNATURE_PALM_DESKTOP_TO_DO_ARCHIVE = new FileSignature(
  "00 01 42 44",
  0,
  "Palm Desktop To Do Archive",
);

export const FILE_SIGNATURE_PALM_DESKTOP_CALENDAR_ARCHIVE_2 = new FileSignature(
  "00 01 44 54",
  0,
  "Palm Desktop Calendar Archive",
);

export const FILE_SIGNATURE_TELEGRAM_DESKTOP_FILE = new FileSignature(
  "54 44 46 24",
  0,
  "Telegram Desktop File",
);

export const FILE_SIGNATURE_TELEGRAM_DESKTOP_FILE_ENCRYPTED = new FileSignature(
  "54 44 45 46",
  0,
  "Telegram Desktop File (Encrypted)",
);

export const FILE_SIGNATURE_PALM_DESKTOP_DATA = new FileSignature(
  "00 01 00 00",
  0,
  "Palm Desktop Data (Access format)",
);

export const FILE_SIGNATURE_COMPUTER_ICON_ENCODED_ICO = new FileSignature(
  "00 00 01 00",
  0,
  "Computer Icon (ICO)",
);

export const FILE_SIGNATURE_APPLE_ICON_IMAGE = new FileSignature(
  "69 63 6e 73",
  0,
  "Apple Icon Image",
);

export const FILE_SIGNATURE_3G_PARTNERSHIP_PROJECT = new FileSignature(
  "66 74 79 70 33 67",
  4,
  "3G Partnership Project",
  "3GPP and 3GPP2",
);

export const FILE_SIGNATURE_HEIC = new FileSignature(
  "66 74 79 70 68 65 69 63",
  4,
  "HEIC",
  "High Efficiency Image Format",
);

export const FILE_SIGNATURE_COMPRESSED_LEMPEL_ZIV_WELCH = new FileSignature(
  "1F 9D",
  0,
  "Compressed file using the Lempel-Ziv-Welch algorithm",
);

export const FILE_SIGNATURE_COMPRESSED_LZH = new FileSignature(
  "1F A0",
  0,
  "Compressed file using the LZH algorithm",
);

export const FILE_SIGNATURE_COMPRESSED_LZH_METHOD_0 = new FileSignature(
  "2D 68 6C 30 2D",
  2,
  "LZH archive file using Method 0",
);

export const FILE_SIGNATURE_COMPRESSED_LZH_METHOD_5 = new FileSignature(
  "2D 68 6C 35 2D",
  2,
  "LZH archive file using Method 5",
);

export const FILE_SIGNATURE_AMIBACK_AMIGA_BACKUP_DATA = new FileSignature(
  "42 41 43 4B 4D 49 4B 45 44 49 53 4B",
  0,
  "AmiBack Amiga Backup Data File",
);

export const FILE_SIGNATURE_AMIBACK_AMIGA_BACKUP_INDEX = new FileSignature(
  "49 4E 44 58",
  0,
  "AmiBack Amiga Backup Index File",
);

export const FILE_SIGNATURE_PLIST = new FileSignature(
  "62 70 6C 69 73 74",
  0,
  "Binary PList file",
);

export const FILE_SIGNATURE_BZIP2_COMPRESSED_FILE = new FileSignature(
  "42 5A 68",
  0,
  "Bzip2 compressed file",
);

export const FILE_SIGNATURE_GIF = new FileSignature(
  "47 49 46 38 37 61",
  0,
  "GIF 87a",
);

export const FILE_SIGNATURE_GIF_2 = new FileSignature(
  "47 49 46 38 39 61",
  0,
  "GIF 89a",
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

export const FILE_SIGNATURE_QOI = new FileSignature(
  "71 6f 69 66",
  0,
  "QOI",
  "Quite Ok Image Format",
);

export const FILE_SIGNATURE_IFF_BITMAP = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 49 4C 42 4D",
  0,
  "IFF Interleaved Bitmap Image",
);

export const FILE_SIGNATURE_IFF_SMAPLED_VOICE = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 38 53 56 58",
  0,
  "IFF Sampled Voice",
);

export const FILE_SIGNATURE_AMIGA_CONTIGUOUS_BITMAP = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 41 43 42 4D",
  0,
  "Amiga Contiguous Bitmap",
);

export const FILE_SIGNATURE_IFF_ANIMATED_BITMAP = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 41 4E 42 4D",
  0,
  "IFF Animated Bitmap",
);

export const FILE_SIGNATURE_IFF_CEL_ANIMATION = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 41 4E 49 4D",
  0,
  "IFF CEL Animation",
);

export const FILE_SIGNATURE_IFF_FACSMILE_IMAGE = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 46 41 58 58",
  0,
  "IFF Facsimile Image",
);

export const FILE_SIGNATURE_IFF_FORMATTED_TEXT = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 46 54 58 54",
  0,
  "IFF Formatted Text",
);

export const FILE_SIGNATURE_IFF_SIMPLE_MUSICAL_SCORE = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 53 4D 55 53",
  0,
  "IFF Simple Musical Score",
);

export const FILE_SIGNATURE_IFF_MUSICAL_SCORE = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 43 4D 55 53",
  0,
  "IFF Musical Score",
);

export const FILE_SIGNATURE_IFF_YUV_IMAGE = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 59 55 56 4E",
  0,
  "IFF YUV Image",
);

export const FILE_SIGNATURE_AMIGA_FANTAVISION = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 46 41 4E 54",
  0,
  "Amiga Fantavision Movie",
);

export const FILE_SIGNATURE_AIFF = new FileSignature(
  "46 4F 52 4D ?? ?? ?? ?? 41 49 46 46",
  0,
  "AIFF",
);

export const FILE_SIGNATURE_LZIP = new FileSignature(
  "4C 5A 49 50",
  0,
  "lzip compressed file",
);

export const FILE_SIGNATURE_CPIO_ARCHIVE = new FileSignature(
  "30 37 30 37 30 37",
  0,
  "cpio archive file",
);

export const FILE_SIGNATURE_DOS_MZ_EXECUTABLE = new FileSignature(
  "4D 5A",
  0,
  "DOS MZ executable",
  "This might also include it's decendents NE and PE",
);

export const FILE_SIGNATURE_SMART_SNIFF_PACKETS = new FileSignature(
  "53 4D 53 4E 46 32 30 30",
  0,
  "Smart Sniff Packets",
);

export const FILE_SIGNATURE_DOS_ZM_EXECUTABLE = new FileSignature(
  "5A 4D",
  0,
  "DOS ZM executable",
);

export const FILE_SIGNATURE_ZIP_NORMAL = new FileSignature(
  "50 4B 03 04",
  0,
  "zip file",
);

export const FILE_SIGNATURE_ZIP_EMPTY = new FileSignature(
  "50 4B 05 06",
  0,
  "zip file (empty archive)",
);

export const FILE_SIGNATURE_ZIP_SPANNED = new FileSignature(
  "50 4B 07 08",
  0,
  "zip file (spanned archive)",
);

export const FILE_SIGNATURE_ROSHA_ARCHIVE_V1_5 = new FileSignature(
  "52 61 72 21 1A 07 00",
  0,
  "ROSHA Archive >= v1.5",
);

export const FILE_SIGNATURE_ROSHA_ARCHIVE_V5 = new FileSignature(
  "52 61 72 21 1A 07 01 00",
  0,
  "ROSHA Archive >= v5",
);

export const FILE_SIGNATURE_EXECUTABLE_AND_LINKABLE_FORMAT = new FileSignature(
  "7F 45 4C 46",
  0,
  "Executable and Linkable Format",
);

export const FILE_SIGNATURE_PNG = new FileSignature(
  "89 50 4E 47 0D 0A 1A 0A",
  0,
  "PNG",
);

export const FILE_SIGNATURE_HIERARCHICAL_DATA_FORMAT_V4 = new FileSignature(
  "0E 03 13 01",
  0,
  "Hierarchical Data Format v4",
);

export const FILE_SIGNATURE_HIERARCHICAL_DATA_FORMAT_V5 = new FileSignature(
  "89 48 44 46 0D 0A 1A 0A",
  0,
  "Hierarchical Data Format v5",
);

export const FILE_SIGNATURE_CPM3 = new FileSignature("C9", 0, "CP/M 3");

export const FILE_SIGNATURE_JAVAS_CLASS = new FileSignature(
  "CA FE BA BE",
  0,
  "Java's class file",
);

export const FILE_SIGNATURE_UTF8 = new FileSignature("EF BB BF", 0, "UTF-8");

export const FILE_SIGNATURE_UTF_16_LE = new FileSignature(
  "FF FE",
  0,
  "UTF-16 Little Edian",
);

export const FILE_SIGNATURE_UTF_16_BE = new FileSignature(
  "FE FF",
  0,
  "UTF-16 Big Edian",
);

export const FILE_SIGNATURE_UTF_32_LE = new FileSignature(
  "FF FE 00 00",
  0,
  "UTF-32 Little Edian",
);

export const FILE_SIGNATURE_UTF_32_BE = new FileSignature(
  "00 00 FE FF",
  0,
  "UTF-32 Big Edian",
);

export const FILE_SIGNATURE_UTF7_1 = new FileSignature(
  "2B 2F 76 38",
  0,
  "UTF-7",
);

export const FILE_SIGNATURE_UTF7_2 = new FileSignature(
  "2B 2F 76 39",
  0,
  "UTF-7",
);

export const FILE_SIGNATURE_UTF7_3 = new FileSignature(
  "2B 2F 76 2B",
  0,
  "UTF-7",
);

export const FILE_SIGNATURE_UTF7_4 = new FileSignature(
  "2B 2F 76 2F",
  0,
  "UTF-7",
);

export const FILE_SIGNATURE_SCSU = new FileSignature(
  "0E FE FF",
  0,
  "SCSU byte order mark text",
);

export const FILE_SIGNATURE_UTF_EBCDIC = new FileSignature(
  "DD 73 66 73",
  0,
  "UTF-EBCDIC",
);

export const FILE_SIGNATURE_MACH_O_32BIT = new FileSignature(
  "FE ED FA CE",
  0,
  "Mach-O 32-bit",
);

export const FILE_SIGNATURE_MACH_O_64BIT = new FileSignature(
  "FE ED FA CF",
  0,
  "Mach-O 64-bit",
);

export const FILE_SIGNATURE_JAVAKEY_STORE = new FileSignature(
  "FE ED FE ED",
  0,
  "JKS Javakey Store",
);

export const FILE_SIGNATURE_MAC_O_32BIT_REVERSE = new FileSignature(
  "CE FA ED FE",
  0,
  "Mach-0 32-bit reverse",
);

export const FILE_SIGNATURE_MAC_O_64BIT_REVERSE = new FileSignature(
  "CF FA ED FE",
  0,
  "Mach-0 64-bit reverse",
);

export const FILE_SIGNATURE_POST_SCRIPT = new FileSignature(
  "25 21 50 53",
  0,
  "PostScript document",
);

export const FILE_SIGNATURE_ENCAPSULATED_POST_SCRIPT_V3 = new FileSignature(
  "25 21 50 53 2D 41 64 6F 62 65 2D 33 2E 30 20 45 50 53 46 2D 33 2E 30",
  0,
  "Encapsulated PostScript v3",
);

export const FILE_SIGNATURE_ENCAPSULATED_POST_SCRIPT_V3_1 = new FileSignature(
  "25 21 50 53 2D 41 64 6F 62 65 2D 33 2E 31 20 45 50 53 46 2D 33 2E 30",
  0,
  "Encapsulated PostScript v3.1",
);

export const FILE_SIGNATURE_MS_WINDOWS_HTML_HELP = new FileSignature(
  "49 54 53 46 03 00 00 00 60 00 00 00",
  0,
  "MS Windows HTMLHelp Data",
);

export const FILE_SIGNATURE_MS_WINDOWS_HELP_FILE = new FileSignature(
  "3F 5F",
  0,
  "Windows 3.x/95/98 Help File",
);

export const FILE_SIGNATURE_PDF = new FileSignature("25 50 44 46 2D", 0, "PDF");

// 0-----

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

// Not on wiki list

//heif
// HEVC
