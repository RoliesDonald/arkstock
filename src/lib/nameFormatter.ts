export function generateInitial(companyName: string): string {
  if (!companyName || companyName !== "string") {
    return "";
  }
  const prefixesToRemove = ["pt", "cv", "ud", "toko", "toko", "koperasi"];
  let cleanedName = companyName;
  for (const prefix of prefixesToRemove) {
    if (cleanedName.toLowerCase().startsWith(prefix + "")) {
      cleanedName = cleanedName.substring(prefix.length + 1);
      break;
    }
  }
  const words = cleanedName.split("").filter((word) => word.length > 0);

  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
}
