import { Element } from "@/generated";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

type SlotElementState<TSlot extends string> = Partial<Record<TSlot, Element>>;

const RADIX_PER_FIELD = 8;
const ELEMENT_CODE: Record<Element, number> = {
  [Element.Metal]: 1,
  [Element.Wood]: 2,
  [Element.Water]: 3,
  [Element.Fire]: 4,
  [Element.Earth]: 5,
};

const decodeElementCode = (code: number): Element | undefined => {
  switch (code) {
    case 0:
      return undefined;
    case 1:
      return Element.Metal;
    case 2:
      return Element.Wood;
    case 3:
      return Element.Water;
    case 4:
      return Element.Fire;
    case 5:
      return Element.Earth;
    default:
      return undefined;
  }
};

const parseBase36ToNumber = (value: string): number | null => {
  if (!/^[0-9a-z]+$/i.test(value)) {
    return null;
  }

  let parsed = 0;
  const normalized = value.toLowerCase();
  for (const char of normalized) {
    const digit = parseInt(char, 36);
    if (Number.isNaN(digit)) {
      return null;
    }
    parsed = parsed * 36 + digit;
    if (!Number.isSafeInteger(parsed)) {
      return null;
    }
  }

  return parsed;
};

const encodeSimulatorState = <TSlot extends string>(
  slotOrder: readonly TSlot[],
  slotElements: SlotElementState<TSlot>,
  characterElement: Element | undefined
): string | undefined => {
  const codes: number[] = [];
  for (const slot of slotOrder) {
    codes.push(slotElements[slot] == null ? 0 : ELEMENT_CODE[slotElements[slot]]);
  }
  codes.push(characterElement == null ? 0 : ELEMENT_CODE[characterElement]);

  let packed = 0;
  for (const code of codes) {
    packed = packed * RADIX_PER_FIELD + code;
  }

  if (packed === 0) {
    return undefined;
  }

  return packed.toString(36).toUpperCase();
};

const decodeSimulatorState = <TSlot extends string>(
  slotOrder: readonly TSlot[],
  encodedId: string
): { slotElements: SlotElementState<TSlot>; characterElement: Element | undefined } | null => {
  const packed = parseBase36ToNumber(encodedId);
  if (packed == null) {
    return null;
  }

  const fieldCount = slotOrder.length + 1;
  const maxPackedValue = RADIX_PER_FIELD ** fieldCount;
  if (packed < 0 || packed >= maxPackedValue) {
    return null;
  }

  const slotElements: SlotElementState<TSlot> = {};
  const decodedCodes = Array<number>(fieldCount).fill(0);
  let remaining = packed;
  for (let i = fieldCount - 1; i >= 0; i -= 1) {
    decodedCodes[i] = remaining % RADIX_PER_FIELD;
    remaining = Math.floor(remaining / RADIX_PER_FIELD);
  }

  for (let i = 0; i < slotOrder.length; i += 1) {
    const slot = slotOrder[i];
    const code = decodedCodes[i];
    const element = decodeElementCode(code);
    if (code > 5 || (code > 0 && element == null)) {
      return null;
    }
    if (element != null) {
      slotElements[slot] = element;
    }
  }

  const characterCode = decodedCodes[slotOrder.length];
  const characterElement = decodeElementCode(characterCode);
  if (characterCode > 5 || (characterCode > 0 && characterElement == null)) {
    return null;
  }

  return { slotElements, characterElement };
};

interface UseSimulatorShareStateParams<TSlot extends string> {
  slotOrder: readonly TSlot[];
  weaponSlot: TSlot;
  slotElements: SlotElementState<TSlot>;
  characterElement: Element | undefined;
  setSlotElements: Dispatch<SetStateAction<SlotElementState<TSlot>>>;
  setCharacterElement: Dispatch<SetStateAction<Element | undefined>>;
  setDefaultWeaponElement: Dispatch<SetStateAction<Element | undefined>>;
}

export const useSimulatorShareState = <TSlot extends string>({
  slotOrder,
  weaponSlot,
  slotElements,
  characterElement,
  setSlotElements,
  setCharacterElement,
  setDefaultWeaponElement,
}: UseSimulatorShareStateParams<TSlot>) => {
  const router = useRouter();
  const applyingStateFromUrlRef = useRef(false);

  const queryId = useMemo(() => {
    const idFromQuery = router.query.id;
    return Array.isArray(idFromQuery) ? idFromQuery[0] : idFromQuery;
  }, [router.query.id]);

  useEffect(() => {
    if (!router.isReady || queryId == null) {
      return;
    }

    const decoded = decodeSimulatorState(slotOrder, queryId);
    if (decoded == null) {
      return;
    }

    applyingStateFromUrlRef.current = true;
    setSlotElements(decoded.slotElements);
    setCharacterElement(decoded.characterElement);
    setDefaultWeaponElement(decoded.slotElements[weaponSlot]);
  }, [
    queryId,
    router.isReady,
    setCharacterElement,
    setDefaultWeaponElement,
    setSlotElements,
    slotOrder,
    weaponSlot,
  ]);

  const generateShareUrl = useCallback(() => {
    if (!router.isReady || typeof window === "undefined") {
      return null;
    }

    const encoded = encodeSimulatorState(slotOrder, slotElements, characterElement);
    const url = new URL(window.location.href);
    if (encoded == null) {
      url.searchParams.delete("id");
    } else {
      url.searchParams.set("id", encoded);
    }
    return url.toString();
  }, [
    characterElement,
    router,
    router.isReady,
    slotElements,
    slotOrder,
  ]);

  useEffect(() => {
    if (applyingStateFromUrlRef.current) {
      applyingStateFromUrlRef.current = false;
    }
  }, [slotElements, characterElement]);

  return {
    generateShareUrl,
  };
};
