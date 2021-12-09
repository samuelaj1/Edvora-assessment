import Script from "next/script";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <meta name="description" content="Edvora application" />
        {/*<link rel="icon" href="/assets/images/logo.png" />*/}
        <link href="/assets/css/all.css" rel="stylesheet" />
        <script src="/assets/js/jquery.min.js" />

      </Head>
      <div>{children}</div>

      <Script src="/assets/js/edvora.js" />
    </>
  );
};

export default Layout;
