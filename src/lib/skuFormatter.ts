import { PartVariant } from "@/types/sparepart";
import { get } from "lodash";

export const getPartVariantShortCode = (variant: PartVariant): string => {
  switch (variant) {
    case PartVariant.AFTERMARKET:
      return "AM";
    case PartVariant.RECONDITIONED:
      return "RC";
    case PartVariant.GBOX:
      return "GB";
    case PartVariant.USED:
      return "U";
    default:
      return "";
  }
};

export const getBrandShortCode = (brand?: string): string => {
  if (!brand || brand.trim() === "") {
    return "";
  }
  return brand.trim().substring(0, 3).toUpperCase();
};

export const generateSku = (
  partNumber: string,
  variant: PartVariant,
  brand?: string | null
): string => {
  if (!partNumber) {
    return "";
  }
  const variantCode = getPartVariantShortCode(variant);
  const brandCode = getBrandShortCode(brand === null ? undefined : brand);

  let skuParts: string[] = [partNumber];
  if (brandCode) {
    skuParts.push(brandCode);
  }
  if (variantCode) {
    skuParts.push(variantCode);
  }
  return skuParts.join("-");
};
