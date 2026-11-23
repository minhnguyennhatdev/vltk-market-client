import Head from "next/head";

export default function AiDeliveryLoopPage() {
  return (
    <>
      <Head>
        <title>Claims Delivery Loop</title>
      </Head>
      {/* iframe keeps the page's own styles isolated from the app's global CSS */}
      <iframe
        src="/ai-delivery-loop.html"
        title="Claims Delivery Loop"
        style={{ border: 0, display: "block", width: "100%", height: "100vh" }}
      />
    </>
  );
}
