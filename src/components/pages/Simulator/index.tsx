import { DefaultLayout } from "@/layouts/DefaultLayout";
import { Button, Card, Divider, Input, Modal, Select, Typography, message } from "antd";
import { Element, Slot } from "@/generated";
import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSimulatorShareState } from "./hooks/useSimulatorShareState";

const RING_SLOT = {
  Upper: "RING_UPPER",
  Lower: "RING_LOWER",
} as const;

type BaseSimulatorSlot = Exclude<Slot, typeof Slot.Ring>;
type RingSimulatorSlot = (typeof RING_SLOT)[keyof typeof RING_SLOT];
type SimulatorSlot = BaseSimulatorSlot | RingSimulatorSlot;

const SLOT_ORDER: SimulatorSlot[] = [
  Slot.Gloves,
  Slot.Head,
  Slot.Necklace,
  RING_SLOT.Upper,
  Slot.Armor,
  Slot.Weapon,
  RING_SLOT.Lower,
  Slot.Amulet,
  Slot.Belt,
  Slot.Boots,
];

const SLOT_GRID_POSITION: Record<
  SimulatorSlot,
  { col: number; row: number; rowSpan?: number }
> = {
  [Slot.Gloves]: { col: 1, row: 1 },
  [Slot.Head]: { col: 2, row: 1 },
  [Slot.Necklace]: { col: 3, row: 1 },
  [RING_SLOT.Upper]: { col: 1, row: 2 },
  [Slot.Armor]: { col: 2, row: 2, rowSpan: 2 },
  [Slot.Weapon]: { col: 3, row: 2, rowSpan: 2 },
  [RING_SLOT.Lower]: { col: 1, row: 3 },
  [Slot.Amulet]: { col: 1, row: 4 },
  [Slot.Belt]: { col: 2, row: 4 },
  [Slot.Boots]: { col: 3, row: 4 },
};

const SLOT_LINKS: Record<
  SimulatorSlot,
  SimulatorSlot[]
> = {
  [Slot.Weapon]: [Slot.Necklace, Slot.Armor],
  [Slot.Necklace]: [Slot.Belt, RING_SLOT.Lower],
  [Slot.Head]: [Slot.Armor, Slot.Necklace],
  [Slot.Armor]: [RING_SLOT.Lower, Slot.Belt],
  [Slot.Belt]: [Slot.Amulet, Slot.Gloves],
  [Slot.Boots]: [Slot.Weapon, Slot.Head],
  [Slot.Gloves]: [Slot.Boots, RING_SLOT.Upper],
  [RING_SLOT.Upper]: [Slot.Weapon, Slot.Head],
  [RING_SLOT.Lower]: [Slot.Gloves, Slot.Amulet],
  [Slot.Amulet]: [Slot.Boots, RING_SLOT.Upper],
};

const GENERATED_BY: Record<Element, Element> = {
  [Element.Fire]: Element.Wood,
  [Element.Earth]: Element.Fire,
  [Element.Metal]: Element.Earth,
  [Element.Water]: Element.Metal,
  [Element.Wood]: Element.Water,
};

const SLOT_LABEL_KEYS: Record<SimulatorSlot, string> = {
  [Slot.Weapon]: "weapon",
  [Slot.Necklace]: "necklace",
  [Slot.Armor]: "armor",
  [Slot.Head]: "head",
  [Slot.Belt]: "belt",
  [Slot.Gloves]: "gloves",
  [RING_SLOT.Upper]: "upperRing",
  [RING_SLOT.Lower]: "lowerRing",
  [Slot.Boots]: "boots",
  [Slot.Amulet]: "amulet",
};

const ELEMENT_LABEL_KEYS: Record<Element, string> = {
  [Element.Metal]: "metal",
  [Element.Wood]: "wood",
  [Element.Water]: "water",
  [Element.Fire]: "fire",
  [Element.Earth]: "earth",
};

const ELEMENT_COLORS: Record<Element, string> = {
  [Element.Metal]: "#6b7280",
  [Element.Wood]: "#16a34a",
  [Element.Water]: "#0284c7",
  [Element.Fire]: "#dc2626",
  [Element.Earth]: "#a16207",
};

type SlotElementState = Partial<Record<SimulatorSlot, Element>>;
type SlotResult = {
  slot: SimulatorSlot;
  selectedElement: Element | null;
  requiredElement: Element | null;
  linkedSlots: SimulatorSlot[];
  matchedLinkedSlots: SimulatorSlot[];
  additionalStatCount: number;
};

const DEFAULT_PAIR_GROUPS: SimulatorSlot[][] = [
  [Slot.Head, Slot.Weapon],
  [Slot.Necklace, Slot.Armor],
  [Slot.Belt, RING_SLOT.Lower],
  [Slot.Gloves, Slot.Amulet],
  [Slot.Boots, RING_SLOT.Upper],
];

const createDefaultSetupByWeaponElement = (weaponElement: Element): SlotElementState => {
  const groupElements: Element[] = [weaponElement];
  for (let i = 0; i < DEFAULT_PAIR_GROUPS.length - 1; i += 1) {
    groupElements.push(GENERATED_BY[groupElements[i]]);
  }

  return DEFAULT_PAIR_GROUPS.reduce<SlotElementState>((acc, group, groupIndex) => {
    const groupElement = groupElements[groupIndex];
    group.forEach((slot) => {
      acc[slot] = groupElement;
    });
    return acc;
  }, {});
};

export const Simulator = () => {
  const { t } = useTranslation();
  const [slotElements, setSlotElements] = useState<SlotElementState>({});
  const [characterElement, setCharacterElement] = useState<Element | undefined>(
    undefined
  );
  const [defaultWeaponElement, setDefaultWeaponElement] = useState<
    Element | undefined
  >(undefined);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");

  const getSlotLabel = (slot: SimulatorSlot) =>
    t(`simulator.slots.${SLOT_LABEL_KEYS[slot]}`);
  const getElementLabel = (element: Element) =>
    t(`simulator.elements.${ELEMENT_LABEL_KEYS[element]}`);

  const elementOptions = useMemo(
    () =>
      Object.values(Element).map((value) => ({
        label: (
          <span style={{ color: ELEMENT_COLORS[value], fontWeight: 600 }}>
            {getElementLabel(value)}
          </span>
        ),
        value,
      })),
    [getElementLabel]
  );

  const slotResults = useMemo<SlotResult[]>(() => {
    return SLOT_ORDER.map((slot) => {
      const selectedElement = slotElements[slot];
      const linkedSlots = SLOT_LINKS[slot];

      if (selectedElement == null) {
        return {
          slot,
          selectedElement: null,
          requiredElement: null,
          linkedSlots,
          matchedLinkedSlots: [] as SimulatorSlot[],
          additionalStatCount: 0,
        };
      }

      const requiredElement = GENERATED_BY[selectedElement];
      const matchedLinkedSlots = linkedSlots.filter(
        (linkedSlot) => slotElements[linkedSlot] === requiredElement
      );
      const characterElementBonus = characterElement === requiredElement ? 1 : 0;

      return {
        slot,
        selectedElement,
        requiredElement,
        linkedSlots,
        matchedLinkedSlots,
        additionalStatCount: matchedLinkedSlots.length + characterElementBonus,
      };
    });
  }, [characterElement, slotElements]);

  const { generateShareUrl } = useSimulatorShareState({
    slotOrder: SLOT_ORDER,
    weaponSlot: Slot.Weapon,
    slotElements,
    characterElement,
    setSlotElements,
    setCharacterElement,
    setDefaultWeaponElement,
  });

  const onSave = async () => {
    const savedLink = generateShareUrl();
    if (savedLink == null) {
      return;
    }
    setShareLink(savedLink);
    setShareModalOpen(true);
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(shareLink);
    message.success(t("simulator.shareModal.copySuccess"));
  };

  const renderLinkedSlots = (slotResult: SlotResult) =>
    slotResult.linkedSlots.map((slot, index) => {
      const linkedLabel =
        slotResult.requiredElement == null
          ? getSlotLabel(slot)
          : `${getSlotLabel(slot)} (${getElementLabel(slotResult.requiredElement)})`;
      const isMatched = slotResult.matchedLinkedSlots.includes(slot);

      return (
        <span key={slot} style={isMatched ? { color: "#16a34a" } : undefined}>
          {index > 0 ? ", " : ""}
          {linkedLabel}
        </span>
      );
    });

  return (
    <DefaultLayout>
      <div className="w-full max-w-3xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {t("simulator.title")}
            </Typography.Title>
          </div>
          <div className="flex">
            <Button type="primary" onClick={onSave}>
              {t("simulator.actions.save")}
            </Button>
          </div>
        </div>

        <Divider />

        <Card size="small" style={{ marginBottom: 16 }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Typography.Text strong>
                {t("simulator.defaultWeaponElementLabel")}
              </Typography.Text>
              <Select
                placeholder={t("simulator.placeholders.selectDefaultWeaponElement")}
                allowClear
                options={elementOptions}
                value={defaultWeaponElement}
                style={{ minWidth: 240 }}
                onChange={(value) => {
                  setDefaultWeaponElement(value);
                  setCharacterElement(undefined);
                  if (value == null) {
                    setSlotElements({});
                    return;
                  }
                  setSlotElements(createDefaultSetupByWeaponElement(value));
                }}
              />
            </div>
            <Button
              onClick={() => {
                setCharacterElement(undefined);
                setDefaultWeaponElement(undefined);
                setSlotElements({});
              }}
            >
              {t("simulator.actions.clear")}
            </Button>
          </div>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }}>
          <div className="flex items-center justify-center gap-3">
            <Typography.Text strong>
              {t("simulator.characterElementLabel")}
            </Typography.Text>
            <Select
              placeholder={t("simulator.placeholders.selectCharacterElement")}
              allowClear
              options={elementOptions}
              value={characterElement}
              style={{ minWidth: 240 }}
              onChange={(value) => {
                setCharacterElement(value);
              }}
            />
          </div>
        </Card>

        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-3 grid-rows-4 gap-4 w-fit">
            {slotResults.map((slotResult) => (
              <Card
                key={slotResult.slot}
                title={<div className="text-center">{getSlotLabel(slotResult.slot)}</div>}
                size="small"
                style={{
                  gridColumnStart: SLOT_GRID_POSITION[slotResult.slot].col,
                  gridRowStart: SLOT_GRID_POSITION[slotResult.slot].row,
                  gridRowEnd: `span ${SLOT_GRID_POSITION[slotResult.slot].rowSpan ?? 1}`,
                  borderColor: "#6b7280",
                }}
              >
                <div className="flex flex-col items-center text-center gap-3 justify-center">
                  <Select
                    placeholder={t("simulator.placeholders.selectElement")}
                    allowClear
                    options={elementOptions}
                    value={slotElements[slotResult.slot]}
                    style={{ width: "100%", maxWidth: 220 }}
                    onChange={(value) =>
                      setSlotElements((prev) => ({
                        ...prev,
                        [slotResult.slot]: value,
                      }))
                    }
                  />

                  <Typography.Text type="secondary">
                    {t("simulator.linkedSlotsLabel")}{" "}
                    {renderLinkedSlots(slotResult)}
                  </Typography.Text>

                  <Typography.Text>
                    {t("simulator.additionalStatsLabel")}{" "}
                    <Typography.Text
                      strong
                      style={
                        slotResult.additionalStatCount > 0
                          ? { color: "#16a34a" }
                          : undefined
                      }
                    >
                      +{slotResult.additionalStatCount}
                    </Typography.Text>
                  </Typography.Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Modal
        title={t("simulator.shareModal.title")}
        open={shareModalOpen}
        onCancel={() => setShareModalOpen(false)}
        footer={[
          <Button key="copy" type="primary" onClick={onCopyLink}>
            {t("simulator.shareModal.copy")}
          </Button>,
          <Button key="close" onClick={() => setShareModalOpen(false)}>
            {t("simulator.shareModal.close")}
          </Button>,
        ]}
      >
        <Input
          value={shareLink}
          readOnly
          style={{ marginTop: 12 }}
          onClick={(event) => event.currentTarget.select()}
        />
      </Modal>
    </DefaultLayout>
  );
};
