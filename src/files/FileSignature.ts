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

export const FILE_SIGNATURE_ADVANCED_SYSTEMS_FORMAT = new FileSignature(
  "30 26 B2 75 8E 66 CF 11 A6 D9 00 AA 00 62 CE 6C",
  0,
  "Advanced Systems Format",
);

export const FILE_SIGNATURE_MS_SYSTEM_DEPLOYMENT_IMAGE = new FileSignature(
  "24 53 44 49 30 30 30 31",
  0,
  "Microsoft System Deployment Image",
);

export const FILE_SIGNATURE_OGG = new FileSignature("4F 67 67 53", 0, "Ogg");

export const FILE_SIGNATURE_PHOTOSHOP = new FileSignature(
  "38 42 50 53",
  0,
  "Adobe Photoshop document file",
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

export const FILE_SIGNATURE_ISO_9660_CD_ROM = new FileSignature(
  "43 44 30 30 31",
  0x8001,
  "ISO 9660 CD-ROM",
);

export const FILE_SIGNATURE_CDI_CD_IMAGE = new FileSignature(
  "43 44 30 30 31",
  0x5eac9,
  "CD-i CD Image",
);

export const FILE_SIGNATURE_NINTENDO_GAME_AND_WATCH_IMAGE = new FileSignature(
  "6D 61 69 6E 2E 62 73",
  0,
  "Nintendo Game & Watch Image",
);

export const FILE_SIGNATURE_NES = new FileSignature(
  "4E 45 53",
  0,
  "Nintendo Entertainment System ROM",
);

export const FILE_SIGNATURE_COMMODORE_64_D64 = new FileSignature(
  "A0 32 41 A0 A0 A0",
  0x165a4,
  "Commodore 64 1541 Disk Image (D64)",
);

export const FILE_SIGNATURE_COMMODORE_64_G64 = new FileSignature(
  "47 53 52 2D 31 35 34 31",
  0,
  "Commodore 64 1571 Disk Image (G64)",
);

export const FILE_SIGNATURE_COMMODORE_64_D81 = new FileSignature(
  "A0 33 44 A0 A0",
  0x61819,
  "Commodore 64 1581 Disk Image (D81)",
);

export const FILE_SIGNATURE_COMMODORE_64_TAPE = new FileSignature(
  "43 36 34 20 74 61 70 65 20 69 6D 61 67 65 20 66 69 6C 65",
  0,
  "Commodore 64 Tape Image",
);

export const FILE_SIGNATURE_COMMODORE_64_CARTRIDGE = new FileSignature(
  "43 36 34 20 43 41 52 54 52 49 44 47 45 20 20 20",
  0,
  "Commodore 64 Cartridge Image",
);

export const FILE_SIGNATURE_FLEXIBLE_IMAGE_TRANSPORT_SYSTEM = new FileSignature(
  "53 49 4D 50 4C 45 20 20 3D 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 20 54",
  0,
  "Flexible Image Transport System",
);

export const FILE_SIGNATURE_FLAC = new FileSignature("66 4C 61 43", 0, "FLAC");

export const FILE_SIGNATURE_MIDI = new FileSignature("4D 54 68 64", 0, "MIDI");

export const FILE_SIGNATURE_COMPOUND_FILE_BINARY = new FileSignature(
  "D0 CF 11 E0 A1 B1 1A E1",
  0,
  "Compound File Binary used by Microsoft",
);

export const FILE_SIGNATURE_DALVIK = new FileSignature(
  "64 65 78 0A 30 33 35 00",
  0,
  "Dalvik Executable",
);

export const FILE_SIGNATURE_VMDK = new FileSignature("4B 44 4D", 0, "VMDK");

export const FILE_SIGNATURE_VMWARE_4_VIRTUAL_DISK = new FileSignature(
  "23 20 44 69 73 6B 20 44 65 73 63 72 69 70 74 6F",
  0,
  "VMware 4 Virtual Disk (split)",
);

export const FILE_SIGNATURE_GOOGLE_CHROME_EXTENSION = new FileSignature(
  "43 72 32 34",
  0,
  "Google Chrome Extension or packaged app",
);

export const FILE_SIGNATURE_FREEHAND_8 = new FileSignature(
  "41 47 44 33",
  0,
  "FreeHand 8 document",
);

export const FILE_SIGNATURE_APPLE_WORKS_5 = new FileSignature(
  "05 07 00 00 42 4F 42 4F 05 07 00 00 00 00 00 00 00 00 00 00 00 01",
  0,
  "AppleWorks 5 document",
);

export const FILE_SIGNATURE_APPLE_WORKS_6 = new FileSignature(
  "06 07 E1 00 42 4F 42 4F 06 07 E1 00 00 00 00 00 00 00 00 00 00 01",
  0,
  "AppleWorks 6 document",
);

export const FILE_SIGNATURE_ROXIO_TOAST_CD_IMAGE_1 = new FileSignature(
  "45 52 02 00 00 00",
  0,
  "Roxio Toast CD Image",
);

export const FILE_SIGNATURE_ROXIO_TOAST_CD_IMAGE_2 = new FileSignature(
  "8B 45 52 02 00 00 00",
  0,
  "Roxio Toast CD Image",
);

export const FILE_SIGNATURE_APPLE_DISK_IMAGE = new FileSignature(
  "6B 6F 6C 79",
  0,
  "Apple Disk Image",
);

export const FILE_SIGNATURE_EXTENSIBLE_ARCHIVE = new FileSignature(
  "78 61 72 21",
  0,
  "eXtensible ARchive",
);

export const FILE_SIGNATURE_WINDOWS_FILE_AND_SETTINGS_TRANSFER_REPOSITORY =
  new FileSignature(
    "50 4D 4F 43 43 4D 4F 43",
    0,
    "Windows File and Settings Transfer Repository",
  );

export const FILE_SIGNATURE_NES_2 = new FileSignature(
  "4E 45 53 1A",
  0,
  "Nintendo Entertainment System ROM",
);

export const FILE_SIGNATURE_TAR = new FileSignature(
  "75 73 74 61 72 00 30 30",
  257,
  "tar",
);

export const FILE_SIGNATURE_TAR_2 = new FileSignature(
  "75 73 74 61 72 20 20 00",
  257,
  "tar",
);

export const FILE_SIGNATURE_OAR = new FileSignature(
  "4F 41 52 ??",
  0,
  "OAR file archive format",
);

export const FILE_SIGNATURE_OPEN_PORTABLE_VOXEL = new FileSignature(
  "74 6F 78 33",
  0,
  "Open source portable voxel file",
);

export const FILE_SIGNATURE_MAGIC_LANTERN_VIDEO = new FileSignature(
  "4D 4C 56 49",
  0,
  "Magic Lantern Video",
);

export const FILE_SIGNATURE_WINDOWS_UPDATE_BINARY_DELTA_COMPRESSION =
  new FileSignature(
    "44 43 4D 01 50 41 33 30 50 41 33 30",
    0,
    "Windows Update Binary Delta Compression",
  );

export const FILE_SIGNATURE_7_ZIP = new FileSignature(
  "37 7A BC AF 27 1C",
  0,
  "7-Zip",
);

export const FILE_SIGNATURE_GZIP = new FileSignature("1F 8B", 0, "GZIP");

export const FILE_SIGNATURE_XZ_COMPRESSION_UTILITY_LZMA2 = new FileSignature(
  "FD 37 7A 58 5A 00",
  0,
  "XZ compression utility (LZMA2)",
);

export const FILE_SIGNATURE_LZ4_FRAME_FORMAT = new FileSignature(
  "04 22 4D 18",
  0,
  "LZ4 Frame Format",
);

export const FILE_SIGNATURE_MS_CABINET = new FileSignature(
  "4D 53 43 46",
  0,
  "Microsoft Cabinet",
);

export const FILE_SIGNATURE_MICROSOFT_COMPRESSED_QUANTUM = new FileSignature(
  "53 5A 44 44 88 F0 27 33",
  0,
  "Microsoft compressed file in Quantum format",
);

export const FILE_SIGNATURE_FLIF = new FileSignature("46 4C 49 46", 0, "FLIF");

export const FILE_SIGNATURE_MATROSKA = new FileSignature(
  "1A 45 DF A3",
  0,
  "Matroska (includes WebM)",
);

export const FILE_SIGNATURE_SEAN = new FileSignature(
  "4D 49 4C 20",
  0,
  "SEAN: Session Analysis training file",
);

export const FILE_SIGNATURE_DJVU = new FileSignature(
  "41 54 26 54 46 4F 52 4D ?? ?? ?? ?? 44 4A 56",
  0,
  "DjVu",
);

export const FILE_SIGNATURE_DER_X509_CERTIFICATE = new FileSignature(
  "30 82",
  0,
  "DER X.509 Certificate",
);

export const FILE_SIGANTURE_PEM_X509_CERTIFICATE = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 43 45 52 54 49 46 49 43 41 54 45 2D 2D 2D 2D 2D",
  0,
  "PEM X.509 Certificate",
);

export const FILE_SIGNATURE_PEM_X509_CERTIFICATE_SIGNING_REQUEST =
  new FileSignature(
    "2D 2D 2D 2D 2D 42 45 47 49 4E 20 43 45 52 54 49 46 49 43 41 54 45 20 52 45 51 55 45 53 54 2D 2D 2D 2D 2D",
    0,
    "PEM X.509 Certificate Signing Request",
  );

export const FILE_SIGNATURE_PEM_X509_PKCS8_PRIVATE_KEY = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 50 52 49 56 41 54 45 20 4B 45 59 2D 2D 2D 2D 2D",
  0,
  "PEM X.509 PKCS#8 Private Key",
);

export const FILE_SIGNATURE_PEM_X509_PKCS1_DSA_PRIVATE_KEY = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 44 53 41 20 50 52 49 56 41 54 45 20 4B 45 59 2D 2D 2D 2D 2D",
  0,
  "PEM X.509 PKCS#1 DSA Private Key",
);

export const FILE_SIGNATURE_PEM_X509_PKCS1_RSA_PRIVATE_KEY = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 52 45 41 20 50 52 49 56 41 54 45 20 4B 45 59 2D 2D 2D 2D 2D",
  0,
  "PEM X.509 PKCS#1 RSA Private Key",
);

export const FILE_SIGNATURE_PUTTY_PRIVATE_KEY_V2 = new FileSignature(
  "50 75 54 54 59 2D 55 73 65 72 2D 4B 65 79 2D 46 69 6C 65 2D 32 3A",
  0,
  "PuTTY Private Key v2",
);

export const FILE_SIGNATURE_PUTTY_PRIVATE_KEY_V3 = new FileSignature(
  "50 75 54 54 59 2D 55 73 65 72 2D 4B 65 79 2D 46 69 6C 65 2D 33 3A",
  0,
  "PuTTY Private Key v3",
);

export const FILE_SIGNATURE_OPENSSH_PRIVATE_KEY = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 4F 50 45 4E 53 53 48 20 50 52 49 56 41 54 45 20 4B 45 59 2D 2D 2D 2D 2D",
  0,
  "OpenSSH Private Key",
);

export const FILE_SIGNATURE_OPENSSH_PUBLIC_KEY = new FileSignature(
  "2D 2D 2D 2D 2D 42 45 47 49 4E 20 53 53 48 32 20 4B 45 59 2D 2D 2D 2D 2D",
  0,
  "OpenSSH Public Key",
);

export const FILE_SIGNATURE_DICOM_MEDICAL = new FileSignature(
  "44 49 43 4D",
  128,
  "DICOM Medical File",
);

export const FILE_SIGNATURE_WOFF_1 = new FileSignature(
  "77 4F 46 46",
  0,
  "WOFF 1",
);

export const FILE_SIGNATURE_WOFF_2 = new FileSignature(
  "77 4F 46 32	",
  0,
  "WOFF 2",
);

export const FILE_SIGNTURE_XML_UTF8 = new FileSignature(
  "3C 3F 78 6D 6C 20",
  0,
  "XML UTF-8",
);

export const FILE_SIGNATURE_XML_UTF16_LE = new FileSignature(
  "3C 00 3F 00 78 00 6D 00 6C 00 20",
  0,
  "XML UTF-16 Little Endian",
);

export const FILE_SIGNATURE_XML_UTF16_BE = new FileSignature(
  "00 3C 00 3F 00 78 00 6D 00 6C 00 20",
  0,
  "XML UTF-16 Big Endian",
);

export const FILE_SIGNATURE_XML_UTF32_LE = new FileSignature(
  "3C 00 00 00 3F 00 00 00 78 00 00 00 6D 00 00 00 6C 00 00 00 20 00 00 00",
  0,
  "XML UTF-32 Little Endian",
);

export const FILE_SIGNATURE_XML_UTF32_BE = new FileSignature(
  "00 00 00 3C 00 00 00 3F 00 00 00 78 00 00 00 6D 00 00 00 6C 00 00 00 20",
  0,
  "XML UTF-32 Big Endian",
);

export const FILE_SIGNATURE_XML_EBCDIC = new FileSignature(
  "4C 6F A7 94 93 40",
  0,
  "XML EBCDIC",
);

export const FILE_SIGNATURE_WASM = new FileSignature(
  "00 61 73 6D",
  0,
  "WebAssembly",
);

export const FILE_SIGNATURE_LEPTON_JPEG = new FileSignature(
  "CF 84 01",
  0,
  "Lepton compressed JPEG",
);

export const FILE_SIGNATURE_ADOBE_FLASH_1 = new FileSignature(
  "43 57 53",
  0,
  "Adobe Flash",
);

export const FILE_SIGNATURE_ADOBE_FLASH_2 = new FileSignature(
  "46 57 53",
  0,
  "Adobe Flash",
);

export const FILE_SIGNATURE_LINUX_DEB = new FileSignature(
  "21 3C 61 72 63 68 3E 0A",
  0,
  "Linux deb file",
);

export const FILE_SIGNATURE_WEBP = new FileSignature(
  "52 49 46 46 ?? ?? ?? ?? 57 45 42 50",
  0,
  "WebP",
);

export const FILE_SIGNATURE_DAS_UBOOT = new FileSignature(
  "27 05 19 56",
  0,
  "Das U-Boot",
);

export const FILE_SIGNATURE_RTF = new FileSignature(
  "7B 5C 72 74 66 31",
  0,
  "Rich Text Format (RTF)",
);

export const FILE_SIGNATURE_MPEG_2_PART_1 = new FileSignature(
  "47",
  0,
  "MPEG-2 Part 1",
);

export const FILE_SIGNATURE_MICROSOFT_TAPE = new FileSignature(
  "54 41 50 45",
  0,
  "Microsoft Tape Format",
);

export const FILE_SIGNATURE_MPEG_PROGRAM_STREAM = new FileSignature(
  "00 00 01 BA",
  0,
  "MPEG Program Stream",
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

export const FILE_SIGNATURE_ZLIB_NO_COMPRESSION = new FileSignature(
  "78 01",
  0,
  "zlib (no compression)",
);

export const FILE_SIGNATURE_ZLIB_BEST_SPEED = new FileSignature(
  "78 5E",
  0,
  "zlib (best speed)",
);

export const FILE_SIGNATURE_ZLIB_DEFAULT_COMPRESSION = new FileSignature(
  "78 9C",
  0,
  "zlib (default compression)",
);

export const FILE_SIGNATURE_ZLIB_BEST_COMPRESSION = new FileSignature(
  "78 DA",
  0,
  "zlib (best compression)",
);

export const FILE_SIGNATURE_ZLIB_NO_COMPRESSION_WITH_DICTIONARY =
  new FileSignature("78 20", 0, "zlib (no compression with dictionary)");

export const FILE_SIGNATURE_ZLIB_BEEST_SPEED_WITH_DICTIONARY =
  new FileSignature("78 7D", 0, "zlib (best speed with dictionary)");

export const FILE_SIGNATURE_ZLIB_DEFAULT_COMPRESSION_WITH_DICTIONARY =
  new FileSignature("78 BB", 0, "zlib (default compression with dictionary)");

export const FILE_SIGNATURE_ZLIB_BEST_COMPRESSION_WITH_DICTIONARY =
  new FileSignature("78 F9", 0, "zlib (best compression with dictionary)");

export const FILE_SIGNATURE_LZFSE = new FileSignature(
  "62 76 78 32",
  0,
  "LZFSE style data compression using Finite State Entropy",
)

export const FILE_SIGNATURE_APACHE_OPTIMIZED_ROW_COLUMNAR = new FileSignature(
  "4F 52 43",
  0,
  "Apache Optimized Row Columnar (ORC)",
)

export const FILE_SIGNATURE_APACHE_ARVO = new FileSignature(
  "4F 62 6A 01",
  0,
  "Apache Avro binary file",
)

export const FILE_SIGNATURE_RCFILE_COLUMNAR = new FileSignature(
  "53 45 51 36",
  0,
  "RCFile columnar file",
)

export const FILE_SIGNATURE_ROBLOX_PLACE = new FileSignature(
  "3C 72 6F 62 6C 6F 78 21",
  0,
  "Roblox Place",
);

export const FILE_SIGNATURE_PHOTOCAP_OBJECT_TEMPLATE = new FileSignature(
  "65 87 78 56",
  0,
  "PhotoCap Object Template",
)

export const FILE_SIGANTURE_PHOTOCAP_VECTOR = new FileSignature(
  "55 55 AA AA",
  0,
  "PhotoCap Vector",
)

export const FILE_SIGNATURE_PHOTOCAP_TEMPLATE = new FileSignature(
  "78 56 34",
  0,
  "PhotoCap Template",
)

export const FILE_SIGNATURE_APACHE_PRAQUET_COLUMNAR = new FileSignature(
  "50 41 52 31",
  0,
  "Apache Parquet columnar file",
)

export const FILE_SIGNATURE_EMULATOR_EMAXSYNTH_SAMPLES = new FileSignature(
  "45 4D 58 32",
  0,
  "Emulator Emaxsynth Samples",
)

export const FILE_SIGNATURE_LUA_BYTECODE = new FileSignature(
  "45 4D 55 33",
  0,
  "Lua bytecode",
)

export const FILE_SIGNATURE_FILE_ALIAS = new FileSignature(
  "62 6F 6F 6B 00 00 00 00 6D 61 72 6B 00 00 00 00",
  0,
  "File Alias",
)

export const FILE_SIGNATURE_MICROSOFT_ZOME_IDENTIFIER = new FileSignature(
  "5B 5A 6F 6E 65 54 72 61 6E 73 66 65 72 5D",
  0,
  "Microsoft Zone Identifier for URL Security Zones",
)

export const FILE_SIGNATURE_EMAIL_MESSAGE_VAR5 = new FileSignature(
  "52 65 63 65 69 76 65 64 3A",
  0,
  "Email Message var5",
)

export const FILE_SIGNATURE_TABLEAU_DATASTORE = new FileSignature(
  "20 02 01 62 A0 1E AB 07 02 00 00 00",
  0,
  "Tableau Datastore",
)

export const FILE_SIGNATURE_KDB = new FileSignature(
  "37 48 03 02 00 00 00 00 58 35 30 39 4B 45 59",
  0,
  "KDB",
)

export const FILE_SIGANTURE_PGP = new FileSignature(
  "85 ?? ?? 03",
  0,
  "PGP",
)

export const FILE_SIGNATURE_ZSTANDARD_COMPRESS = new FileSignature(
  "28 B5 2F FD",
  0,
  "Zstandard Compress",
)

export const FILE_SIGNATURE_QUICK_ZIP_RS_COMPRESSED = new FileSignature(
  "52 53 56 4B 44 41 54 41",
  0,
  "QuickZip rs compressed archive",
)

export const FILE_SIGNATURE_SMILE = new FileSignature(
  "3A 29 0A",
  0,
  "Smile",
)

export const FILE_SIGNATURE_PREFERRED_EXECUTABLE_FORMAT = new FileSignature(
  "4A 6F 79 21",
  0,
  "Preferred Executable Format",
)

export const FILE_SIGNATURE_VPK_FILE = new FileSignature(
  "34 12 AA 55",
  0,
  "VPK file",
  "Used by Source Engine",
)

export const FILE_SIGNATURE_ACE_COMPRESSED = new FileSignature(
  "2A 2A 41 43 45 2A 2A",
  7,
  "ACE compressed file",
)

export const FILE_SIGNATURE_ARJ = new FileSignature(
  "60 EA",
  0,
  "ARJ",
)

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
