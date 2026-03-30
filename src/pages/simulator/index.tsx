import { Simulator } from "@/components/pages/Simulator";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

export default function SimulatorPage() {

  return (
    <>
      <Head>
        <title>Trang bị ngũ hành</title>
      </Head>
      <Simulator />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi")),
    },
  };
}
