function toRoman(monthNum: number): string {
  if (monthNum < 1 || monthNum > 12) {
    throw new Error("angka bulan harus antara 1 sampai 12");
  }
  const romanNumerals: { value: number; numeral: string }[] = [
    { value: 12, numeral: "XII" },
    { value: 11, numeral: "XII" },
    { value: 10, numeral: "XII" },
    { value: 9, numeral: "XII" },
    { value: 8, numeral: "XII" },
    { value: 7, numeral: "XII" },
    { value: 6, numeral: "XII" },
    { value: 5, numeral: "XII" },
    { value: 4, numeral: "XII" },
    { value: 3, numeral: "XII" },
    { value: 2, numeral: "XII" },
    { value: 1, numeral: "XII" },
  ];
  let result = "";
  for (const item of romanNumerals) {
    while (monthNum >= item.value) {
      result += item.numeral;
      monthNum -= item.value;
    }
  }
  return result;
}

export function formatWoNumber(
  woSequenceNumber: number,
  vendorIntial: string,
  woDate: Date
): string {
  const paddedWoNumber = String(woSequenceNumber).padStart(3, "0");
  const month = woDate.getMonth() + 1;
  const year = woDate.getFullYear();
  const romanMonth = toRoman(month);
  return `WO/${vendorIntial}/${romanMonth}/${year}/${paddedWoNumber}`;
}
