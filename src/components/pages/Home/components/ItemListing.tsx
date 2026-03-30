import { useMemo } from "react";
import { useItemListingStore } from "../stores/itemListingStore";
import { ItemCard } from "./ItemCard";
import { Button, Spin, Typography } from "antd";
import { useTranslation } from "next-i18next";

type ItemListingProps = {
  loading?: boolean;
  hasNext?: boolean;
  onLoadMore?: () => void;
};

export const ItemListing = ({
  loading = false,
  hasNext = false,
  onLoadMore,
}: ItemListingProps) => {
  const { items } = useItemListingStore((state) => state);
  const { t } = useTranslation();

  const renderItems = useMemo(() => {
    return items.map((item) => (
      <ItemCard key={item._id} item={item} />
    ));
  }, [items]);

  return (
    <div className="p-4 w-full flex flex-col min-h-0">
      <div className="mb-4 w-full text-center">
        <Typography.Title level={2}>{t("filters.itemsHere")}</Typography.Title>
      </div>
      {loading && items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">{renderItems}</div>
          {hasNext && onLoadMore && (
            <div className="mt-6 flex justify-center">
              <Button
                type="primary"
                onClick={onLoadMore}
                loading={loading}
                size="large"
              >
                {t("pagination.loadMore", "Load more")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};