import { CreateItemResponseDTO, GetItemSpecResponseDTO, ItemOwnerDTO } from "@/generated";
import { Button, Card, Modal, Typography } from "antd";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import pick from "lodash/pick";
import { useItemListingStore } from "../stores/itemListingStore";
import TextArea from "antd/es/input/TextArea";
import omit from "lodash/omit";

export const ItemCard = (props: { item: CreateItemResponseDTO }) => {
  const { t } = useTranslation();
  const [viewImage, setViewImage] = useState(false);

  const itemSpecs = useItemListingStore((state) => state.itemSpecs);

  const handleViewImage = () => {
    setViewImage(true);
  };

  const renderInlineText = (key: string, label: string, value: string) => {
    return (
      <div key={key} className="flex justify-between items-center gap-4">
        <Typography.Text >{label}</Typography.Text>
        <Typography.Text>{value}</Typography.Text>
      </div>
    );
  };

  const findSpecTitle = useCallback((key: string, value: string) => {
    const spec = itemSpecs[key as keyof GetItemSpecResponseDTO];
    return spec?.find((spec) => spec.code === value)?.title || String(value);
  }, [itemSpecs]);

  const dispaylingInfo = useMemo(() => {
    return Object.entries(pick(props.item, ['category', 'slot', 'weaponType', 'element', 'level', 'gender'])).map(([key, value]) => {
      const valueTitle = findSpecTitle(key, String(value));
      return renderInlineText(key, t(`filters.${key}`), valueTitle);
    });
  }, [props.item, findSpecTitle]);

  const displayStats = useMemo(() => {
    const stats = props.item.stats ?? [];
    return stats.map((entry) => {
      const valueTitle = findSpecTitle('stat', String(entry.code));
      return renderInlineText(String(entry.code), valueTitle, String(entry.value));
    });
  }, [props.item, findSpecTitle]);

  const displayContactInfo = useMemo(() => {
    const renderOwner = Object.entries(omit(props.item.owner, ['contactInfo'])).map(([key, value]) => {
      const valueTitle = findSpecTitle(key, value);
      return renderInlineText(key, t(`owner.${key}`), valueTitle);
    });
    const renderContactInfo = () => {
      return (
        <div className="w-full flex flex-col gap-2 mt-4">
          <Typography.Text>{t("contactInfo")}</Typography.Text>
          <TextArea
            disabled
            value={props.item.owner?.contactInfo}
            styles={{ textarea: { backgroundColor: "#fff", color: "#000", resize: "none" } }}
          />
        </div>
      )
    }
    return (
      <div>
        {renderOwner}
        {props.item.owner?.contactInfo ? renderContactInfo() : null}
      </div>
    )
  }, [props.item.owner, findSpecTitle]);

  return (
    <Card
      style={{ width: "100%" }}
      styles={{
        body: {
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 8,
        },
      }}
      className="shadow-md"
    >

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <Typography.Title
            style={{ marginBottom: 0, }}
            level={4}>
            {props.item.name}
          </Typography.Title>
          <div>-</div>
          {props.item.image && (
            <>
              <Button
                type="link"
                onClick={handleViewImage}
                style={{ padding: 0 }}
              >
                {t("viewImage")}
              </Button>
              <Modal
                open={viewImage}
                onCancel={() => setViewImage(false)}
                footer={null}
                width="min(90vw, 800px)"
                centered
                closable
                mask={
                  {
                    closable: true
                  }
                }
                styles={{ body: { padding: 24, display: "flex", justifyContent: "center" } }}
              >
                <Image
                  src={props.item.image}
                  alt={props.item.name}
                  width={1000}
                  height={1000}
                  className="w-full h-auto max-w-full object-contain"
                  style={{ maxHeight: "80vh" }}
                />
              </Modal>
            </>
          )}
        </div>
        <Typography.Text>{props.item.description}</Typography.Text>
        <div className="flex gap-4 w-full">
          <div className="w-full">
            <Typography.Title level={5}>{t("basicInfo")}</Typography.Title>
            {dispaylingInfo}
          </div>
          <div className="border-l border-gray-300 pl-4 w-full">
            <Typography.Title level={5}>{t("stats")}</Typography.Title>
            {displayStats}
          </div>
          <div className="border-l border-gray-300 pl-4 w-full">
            <Typography.Title level={5}>{t("ownerInfo")}</Typography.Title>
            {displayContactInfo}
          </div>
        </div>
      </div>
    </Card>
  );
}