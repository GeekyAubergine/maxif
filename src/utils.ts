export function uint8ToNumber(array: Uint8Array): number {
  if (array.length === 0) {
    return 0;
  }

  const dataView = new DataView(array.buffer);

  if (array.length === 1) {
    return dataView.getUint8(0)
  }

  if (array.length === 2) {
    return dataView.getUint16(0)
  }

  if (array.length === 4) {
    return dataView.getUint32(0)
  }

  throw new Error("Array length must be 1, 2, or 4");
}

export function bytesSizeToHumanReadable(bytes: number): string {
  const sizes = ["B", "KiB", "MiB", "GiB", "TiB"];

  if (bytes === 0) {
    return "0 B";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
