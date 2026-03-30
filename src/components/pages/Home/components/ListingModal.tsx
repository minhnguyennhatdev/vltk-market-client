"use client";

import {
  Category,
  type ItemOwnerDTO,
  type Slot,
  type WeaponType,
  type Element,
  type Gender,
  type Currency,
  type Stat,
  type StatEntryDTO,
  InventoryApi,
} from "@/generated";
import { Button, Form, Input, InputNumber, Modal, Select, Typography, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import { useItemListingStore } from "../stores/itemListingStore";
import { useSpecFields, SPEC_ORDER_CREATE } from "../hooks/useSpecFields";
import { normFile, specToOptions } from "@/utils/transform";

const { TextArea } = Input;

/** Form field values for the listing modal (matches Form.Item names) */
type ListingFormValues = {
  name: string;
  description?: string;
  category: Category;
  slot?: Slot;
  weaponType?: WeaponType;
  element?: Element;
  level?: number;
  gender?: Gender;
  priceCurrency?: Currency;
  askingPrice?: number;
  owner: ItemOwnerDTO;
  stats?: { code: Stat; value: number }[];
  image?: UploadFile[];
};

/** API request body for create item (no image; image is uploaded separately) */
type CreateItemRequestBody = Omit<ListingFormValues, "image"> & {
  stats?: Array<StatEntryDTO>;
};

type ListingModalProps = {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
};

export const ListingModal = ({ open, onCancel, onSuccess }: ListingModalProps) => {
  const { t } = useTranslation();
  const itemSpecs = useItemListingStore((s) => s.itemSpecs);
  const items = useItemListingStore((s) => s.items);
  const setItems = useItemListingStore((s) => s.setItems);
  const [form] = Form.useForm<ListingFormValues>();
  const [loading, setLoading] = useState(false);
  const category = Form.useWatch("category", form);

  const handleSubmit = async (values: ListingFormValues) => {
    const { owner: ownerFromForm, stats: statsList = [], image: fileList = [], ...rest } = values;
    const stats: StatEntryDTO[] = (statsList ?? [])
      .filter((e): e is { code: Stat; value: number } => e?.code != null && typeof e?.value === "number")
      .map(({ code, value }) => ({ code, value }));

    const owner: ItemOwnerDTO = {
      server: ownerFromForm?.server,
      playerName: ownerFromForm?.playerName,
      contactInfo: ownerFromForm?.contactInfo,
    };

    const body: CreateItemRequestBody = {
      ...rest,
      owner,
      stats: stats.length ? stats : undefined,
    };

    const file = fileList[0]?.originFileObj ?? undefined;

    setLoading(true);
    try {
      const inventoryApi = new InventoryApi();
      const { data } = await inventoryApi.inventoryControllerCreateItemV1({
        createItemRequestDTO: body,
      });
      if (!data?.data) return;

      const createdId = data.data._id;
      let itemToAdd = data.data;

      if (file) {
        const uploadRes = await inventoryApi.inventoryControllerUploadItemImageV1({
          id: createdId,
          image: file as File,
        });
        if (uploadRes.data?.data) itemToAdd = uploadRes.data.data;
      }

      setItems([itemToAdd, ...items]);
      form.resetFields();
      onCancel();
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const specFields = useSpecFields(itemSpecs, category, {
    excludeKeys: ["stat", "currency", "server"],
    order: SPEC_ORDER_CREATE,
  });

  const renderSpecFields = useMemo(() => {
    return specFields.map(({ key, options: specOptions }) => {
      const label = t(`filters.${key}`);
      return (
        <Form.Item key={key} name={key} label={label}>
          <Select options={specToOptions(specOptions ?? [])} placeholder={label} />
        </Form.Item>
      );
    });
  }, [specFields, t]);

  return (
    <Modal
      closable={false}
      title={
        <div className="flex items-center w-full mb-8 gap-4">
          <Button
            style={{ width: "33.3333%" }}
            onClick={handleCancel}
          >
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            style={{ width: "66.6666%" }}
            onClick={() => form.submit()}
            loading={loading}
          >
            {t("home.sellItems")}
          </Button>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      destroyOnHidden
      centered
      styles={{
        body: { maxHeight: "70vh", overflowY: "auto", overflowX: "hidden", minWidth: 0 },
      }}
      closeIcon={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="pt-2"
      >
        <div className="grid grid-cols-3 gap-x-4 min-w-0">
          {/* Column 1: Item & specs */}
          <div className="flex flex-col gap-0 min-w-0">
            <Typography.Title level={5} className="mt-0!">
              {t("basicInfo")}
            </Typography.Title>
            <Form.Item
              name="name"
              label={t("itemName")}
              rules={[{ required: true, message: t("validation.missingValue") }]}
            >
              <Input placeholder={t("itemName")} />
            </Form.Item>
            <Form.Item name="description" label={t("description")}>
              <TextArea rows={2} />
            </Form.Item>
            {renderSpecFields}
            <Form.Item name="level" label={t("filters.level")}>
              <InputNumber
                placeholder={t("filters.levelPlaceholder")}
                style={{ width: "100%" }}
                min={1}
              />
            </Form.Item>
          </div>

          {/* Column 2: Owner + price */}
          <div className="flex flex-col gap-0 w-full min-w-0">
            <Typography.Title level={5} className="mt-0!">
              {t("ownerInfo")}
            </Typography.Title>
            <Form.Item
              name={["owner", "server"]}
              label={t("owner.server")}
              rules={[{ required: true, message: t("validation.missingValue") }]}
            >
              <Select
                options={specToOptions(itemSpecs.server)}
                placeholder={t("owner.server")}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name={["owner", "playerName"]}
              label={t("owner.playerName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={["owner", "contactInfo"]} label={t("owner.contactInfo")}>
              <TextArea rows={2} placeholder={t("owner.contactInfoPlaceholder")} />
            </Form.Item>
            <div className="flex gap-x-2 w-full min-w-0">
              <Form.Item name="askingPrice" label={t("askingPrice")} className="mb-0 flex-1 min-w-0">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
              </Form.Item>
              <Form.Item name="priceCurrency" label={t("filters.currency")} className="mb-0 shrink-0 w-1/3">
                <Select
                  options={specToOptions(itemSpecs.currency)}
                  placeholder={t("filters.currency")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </div>

          {/* Column 3: Stat filter with left divider */}
          <div className="flex flex-col gap-0 border-l border-gray-300 pl-4 min-w-0 overflow-hidden">
            <Form.Item
              label={(<Typography.Title level={5} className="mt-0!">{t("stats")} </Typography.Title>)}
              className="mb-0">
              <Form.List name="stats">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...rest }) => (
                      <div
                        key={key}
                        className="flex items-baseline gap-2 w-full min-w-0 mb-2 overflow-hidden"
                      >
                        <Form.Item
                          {...rest}
                          name={[name, "code"]}
                          rules={[{ required: true, message: t("validation.missingKey") }]}
                          style={{ marginBottom: 0, flex: "1 1 0", minWidth: 0 }}
                          className="min-w-0"
                        >
                          <Select
                            style={{ width: "100%", minWidth: 0 }}
                            options={specToOptions(itemSpecs.stat)}
                          />
                        </Form.Item>
                        <Form.Item
                          {...rest}
                          name={[name, "value"]}
                          rules={[{ required: true }]}
                          style={{ marginBottom: 0, flex: "0 0 auto", minWidth: 0, maxWidth: "3rem" }}
                          className="shrink-0 w-12 overflow-hidden [&_.ant-form-item-explain]:hidden!"
                        >
                          <InputNumber
                            className="w-full min-w-0"
                            style={{ minWidth: 0, maxWidth: "100%" }}
                            controls={false}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          className="shrink-0 text-red-500 cursor-pointer ml-2"
                          onClick={() => remove(name)}
                        />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        {t("filters.addStat")}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item
              name="image"
              className="mt-2"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                maxCount={1}
                listType="picture-card"
                accept="image/*"
                name="image"
                beforeUpload={() => false}
              >
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
