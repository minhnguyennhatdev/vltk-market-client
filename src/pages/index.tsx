import { Home } from "@/components/pages/Home";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Index() {
  return <Home />;
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi")),
    },
  };
}
