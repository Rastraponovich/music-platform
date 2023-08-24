import { Provider } from "effector-react/scope";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import { Winamp } from "~/entity/winamp";

import "@/styles/globals.css";

import { Layout } from "~/widgets/layout";

import { useScope } from "~/shared/hooks/use-scope";

const App: NextPage<AppProps> = ({ Component, pageProps, router }) => {
  const scope = useScope(pageProps.initialState);

  return (
    <Provider value={scope}>
      <Layout>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          {/* <script
                    src="https://cdn.jsdelivr.net/npm/react-render-tracker"
                    data-config="inpage:true"
                ></script> */}
        </Head>
        <Component {...pageProps} router={router} />
        <Winamp />
      </Layout>
    </Provider>
  );
};

export default App;
