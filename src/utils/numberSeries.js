import { COVERED } from "@/constant/value";

const arrCover = Object.keys(COVERED).map(Number);

export function isNumericString(str) {
  return /^\d+$/.test(str);
}

export function getThirdDigitFromLeft(str) {
  if (str.length < 3) {
    return null;
  }
  return str[2];
}

export function cutSuffix(str) {
  if (typeof str !== 'string') {
    return str; // Trả về giá trị gốc nếu không phải chuỗi
  }

  const suffix = " - Khám bệnh";
  // Chuyển cả chuỗi và suffix thành chữ thường để so sánh không phân biệt hoa thường
  const lowerStr = str.toLowerCase();
  const lowerSuffix = suffix.toLowerCase();

  if (lowerStr.endsWith(lowerSuffix)) {
    return str.slice(0, -suffix.length); // Cắt phần "- Khám bệnh" nếu có
  }
  return str; // Trả về chuỗi gốc nếu không có đuôi "- Khám bệnh"
}

export const isValidInsuranceCode = (code) => {
  if (code && code.length !== 15) return false;

  const isOldFormat = /^[A-Z]{2}[1-5]\d{2}\d{10}$/.test(code);
  return isOldFormat && arrCover.includes(+getThirdDigitFromLeft(code));
}
