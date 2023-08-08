import { Provider } from "effector-react/scope";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import "tailwindcss/tailwind.css";

import { Winamp } from "@/src/entity/winamp";
import { Layout } from "@/src/widgets/layout";
import "@/styles/globals.css";

import { useScope } from "../src/shared/hooks/use-scope";

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
