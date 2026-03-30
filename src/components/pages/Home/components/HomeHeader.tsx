import { Button, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { ListingModal } from "./ListingModal";

export const HomeHeader = () => {
  const { t } = useTranslation();
  const [listingModalOpen, setListingModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-500">
      <Typography.Title level={4}>{t("home.title")}</Typography.Title>
      <div>
        <Button type="default" onClick={() => setListingModalOpen(true)}>
          {t("home.sellItems")}
        </Button>
      </div>
      <ListingModal
        open={listingModalOpen}
        onCancel={() => setListingModalOpen(false)}
        onSuccess={() => setListingModalOpen(false)}
      />
    </div>
  );
};