import { uint8ToNumber } from "./utils";

describe("#uint8ToNumber", () => {
  it("should convert single byte correctly", () => {
    expect(uint8ToNumber(new Uint8Array([0x01]))).toBe(1);
    expect(uint8ToNumber(new Uint8Array([0xff]))).toBe(255);
  });

  it("should convert multiple bytes correctly", () => {
    expect(uint8ToNumber(new Uint8Array([0x01, 0x02]))).toBe(258);
    expect(uint8ToNumber(new Uint8Array([0xff, 0xff]))).toBe(65535);
  });

  it("should work for actual file size", () => {
    expect(uint8ToNumber(new Uint8Array([0xe2, 0x28, 0x00, 0x00]))).toBe(3794272256);
  });
});

//29.61 KB
