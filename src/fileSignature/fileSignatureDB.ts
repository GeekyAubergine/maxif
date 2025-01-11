import { FileSignature } from "./FileSignature";

const JPEG_SIGNATURE = new FileSignature("JPEG", "FF D8 FF DB");
const JPEG_SIGNATURE_2 = new FileSignature("JPEG", "FF D8 FF EE");
const JPEG_SIGNATURE_3 = new FileSignature("JPEG", "FF D8 FF E0");
const JPEG_JFIF_SIGNATURE = new FileSignature(
  "JPEG JFIF",
  "FF D8 FF E0 ?? ?? 4A 46 49 46 00",
);
const JPEG_EXIF_SIGNATURE = new FileSignature(
  "JPEG EXIF",
  "FF D8 FF E1 ?? ?? 45 78 69 66 00",
);

const PNG_SIGNATURE = new FileSignature("PNG", "89 50 4E 47 0D 0A 1A 0A");

export const FILE_SIGNATURES: FileSignature[] = [
  JPEG_SIGNATURE,
  JPEG_SIGNATURE_2,
  JPEG_SIGNATURE_3,
  JPEG_JFIF_SIGNATURE,
  JPEG_EXIF_SIGNATURE,
  PNG_SIGNATURE,
] as const;
