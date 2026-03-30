import { Category } from "@/generated";
import type { GetItemSpecResponseDTO } from "@/generated";
import { useMemo } from "react";

/** Keys that are only shown when category is Wearable (spec dropdowns + level) */
export const WEARABLE_ONLY_KEYS = ["slot", "weaponType", "element", "gender"] as const;

/** Form fields that are only shown when category is Wearable (includes level, which is not in itemSpecs) */
export const WEARABLE_ONLY_FORM_KEYS = ["slot", "weaponType", "element", "gender", "level"] as const;

/** Whether a form field should be shown only when category is Wearable */
export function isWearableOnlyField(fieldKey: string): fieldKey is (typeof WEARABLE_ONLY_FORM_KEYS)[number] {
  return (WEARABLE_ONLY_FORM_KEYS as readonly string[]).includes(fieldKey);
}

/** True when category is Wearable (show wearable-only fields) */
export function shouldShowWearableOnlyFields(category: Category | null | undefined): boolean {
  return category === Category.Wearable;
}

/** Default order for create/list modal: category first, then wearable-only */
export const SPEC_ORDER_CREATE: readonly string[] = [
  "category",
  "slot",
  "weaponType",
  "element",
  "gender",
];

/** Order for listing filter: server first, then category, then wearable-only (includes level) */
export const SPEC_ORDER_LISTING: readonly string[] = [
  "server",
  "category",
  "slot",
  "weaponType",
  "element",
  "gender",
  "level",
];

export type UseSpecFieldsOptions = {
  /** Keys to exclude from itemSpecs (e.g. ["stat", "currency"] or ["stat", "currency", "server"]) */
  excludeKeys: string[];
  /** Order of field keys. Use SPEC_ORDER_CREATE or SPEC_ORDER_LISTING */
  order?: readonly string[];
};

export type SpecFieldEntry = {
  key: string;
  /** null for non-spec fields (e.g. level) that follow the same display-by-type rule */
  options: { title: string; code: string }[] | null;
};

/**
 * Returns the list of spec fields to display based on category.
 * When category is not Wearable, slot/weaponType/element/gender are omitted.
 * Reusable for listing filter and create listing modal.
 */
export function useSpecFields(
  itemSpecs: GetItemSpecResponseDTO,
  category: Category | null | undefined,
  options: UseSpecFieldsOptions
): SpecFieldEntry[] {
  const { excludeKeys, order = SPEC_ORDER_CREATE } = options;

  return useMemo(() => {
    const entries = Object.entries(itemSpecs).filter(
      (entry): entry is [string, { title: string; code: string }[]] =>
        !excludeKeys.includes(entry[0]) && Array.isArray(entry[1])
    );
    const wearableKeys: readonly string[] = WEARABLE_ONLY_KEYS;
    const filtered =
      category === Category.Wearable
        ? entries
        : entries.filter(([key]) => !wearableKeys.includes(key));
    const byKey = Object.fromEntries(filtered.map(([k, v]) => [k, v]));
    const wearableFormKeys: readonly string[] = WEARABLE_ONLY_FORM_KEYS;
    return order
      .filter(
        (key) =>
          key in byKey ||
          (category === Category.Wearable && wearableFormKeys.includes(key))
      )
      .map((key) => ({
        key,
        options: key in byKey ? byKey[key] : null,
      }));
  }, [itemSpecs, category, excludeKeys, order]);
}
