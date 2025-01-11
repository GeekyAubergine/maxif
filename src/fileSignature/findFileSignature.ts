import { FileSignatureMatch } from "./FileSignature";
import { ReadableFile } from "../entities/types";
import { FILE_SIGNATURES } from "./fileSignatureDB";

export function findSignatureForReadableBuffer(
  readableBuffer: ReadableFile,
): FileSignatureMatch | false {
  for (const signature of FILE_SIGNATURES) {
    const match = signature.matches(readableBuffer);

    if (match) {
      return match;
    }
  }

  return false;
}
