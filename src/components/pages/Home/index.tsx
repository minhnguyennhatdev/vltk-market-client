import {
  Category,
  GameServer,
  Slot,
  WeaponType,
  Element,
  Gender,
  GetItemSpecResponseDTO,
} from "@/generated";
import { DefaultLayout } from "@/layouts/DefaultLayout";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "next-i18next";
import { ItemFilter, useItemListingStore } from "./stores/itemListingStore";
import { createItemListingService } from "./services/itemListingService";
import { useSpecFields, SPEC_ORDER_LISTING } from "./hooks/useSpecFields";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { HomeHeader } from "./components/HomeHeader";
import { ItemListing } from "./components/ItemListing";

interface FormValues extends ItemFilter {
  name?: string;
  description?: string;
  server?: GameServer;
  category?: Category;
  slot?: Slot;
  weaponType?: WeaponType;
  element?: Element;
  gender?: Gender;
  level?: number;
  stat?: Array<{ key: string; value: number }>;
}

export const Home = () => {
  const { t } = useTranslation();
  const {
    filters,
    setFilters,
    itemSpecs,
    pagination,
    loading,
  } = useItemListingStore((state) => state);
  const [form] = Form.useForm<FormValues>();
  const category = Form.useWatch("category", form);

  const specFields = useSpecFields(itemSpecs, category, {
    excludeKeys: ["stat", "currency"],
    order: SPEC_ORDER_LISTING,
  });

  const serviceRef = useRef(
    createItemListingService({
      getState: () => useItemListingStore.getState(),
    })
  );
  const service = serviceRef.current;

  const fetchItems = (skip = 0) => service.fetchItems(skip);
  const loadMore = () => service.loadMore();

  const onFinish = (values: FormValues) => {
    const stats = (values.stat ?? [])
      .filter((e) => e?.key != null && typeof e?.value === "number")
      .map(({ key, value }) => ({ code: key, value }));
    const nextFilters: ItemFilter = {
      name: values.name ?? null,
      description: values.description ?? null,
      category: values.category,
      server: values.server,
      level: values.level,
      stats: stats,
      slot: values.slot,
      weaponType: values.weaponType,
      element: values.element,
      gender: values.gender,
    };
    setFilters(nextFilters);
    fetchItems(0);
  };

  const specToOptions = (spec: { title: string; code: string }[]) => {
    return spec.map((v) => ({
      label: v.title,
      value: v.code,
    }));
  };

  useEffect(() => {
    service.fetchItemSpecs();
  }, []);

  useEffect(() => {
    fetchItems(0);
  }, []);

  const renderFilterSelect = useMemo(() => {
    return specFields.map(({ key, options: specOptions }) => {
      const label = t(`filters.${key}`);
      if (specOptions === null) {
        return (
          <Form.Item key={key} label={label} name={key}>
            <InputNumber
              placeholder={t("filters.levelPlaceholder")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        );
      }
      const options = specToOptions(specOptions);
      return (
        <Form.Item
          key={key}
          className="w-full"
          name={key}
          label={label}
        >
          <Select
            className="w-full"
            options={options}
            allowClear
          />
        </Form.Item>
      );
    });
  }, [t, specFields]);

  const renderStatsFilter = useMemo(() => {
    return (
      <Form.Item label={t("filters.statFilter")}>
        <Form.List name="stat">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="flex items-baseline gap-2 w-full min-w-0"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "key"]}
                    rules={[
                      {
                        required: true,
                        message: t(
                          "validation.missingKey",
                        ),
                      },
                    ]}
                    style={{ marginBottom: 8, flex: "1 1 75%", minWidth: 0 }}
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={specToOptions(itemSpecs.stat)}
                      allowClear
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "value"]}
                    rules={[
                      {
                        required: true,
                        message: t(
                          "validation.missingValue",
                        ),
                      },
                    ]}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      className="w-full"
                      placeholder={t(
                        "greaterThanOrEqual",
                      )}
                    />
                  </Form.Item>

                  <MinusCircleOutlined
                    className="shrink-0"
                    onClick={() => remove(name)}
                  />
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  {t("filters.addStat")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    );
  }, [t, itemSpecs.stat]);

  return (
    <DefaultLayout>
      <HomeHeader />
      <div className="flex min-h-0">
        <div className="p-4 flex flex-col gap-8 w-[512px] border-r border-gray-200">
          <Form
            form={form}
            layout="vertical"
            className="flex-1 h-full"
            onFinish={onFinish}
          >
            <Form.Item label={null} className="mb-4">
              <div className="flex gap-2 w-full">
                <Button className="w-3/4" type="primary" htmlType="submit">
                  {t("filters.search")}
                </Button>
                <Button
                  className="w-1/4"
                  onClick={() => form.resetFields()}
                >
                  {t("filters.clear", "Clear")}
                </Button>
              </div>
            </Form.Item>
            <Form.Item label={t("itemName")} name="name">
              <Input placeholder={t("itemName")} allowClear />
            </Form.Item>
            <Form.Item label={t("description")} name="description">
              <Input.TextArea placeholder={t("description")} allowClear rows={2} />
            </Form.Item>
            {renderFilterSelect}
            {renderStatsFilter}
          </Form>
        </div>
        <ItemListing
          loading={loading}
          hasNext={pagination.hasNext}
          onLoadMore={loadMore}
        />
      </div>
    </DefaultLayout>
  );
};
