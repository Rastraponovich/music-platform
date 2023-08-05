import Head from "next/head"
import type { NextPage } from "next"
import type { AppProps } from "next/app"

import { Provider } from "effector-react/scope"

import "@/styles/globals.css"
import "tailwindcss/tailwind.css"

import { useScope } from "../hooks/useScope"
import Layout from "@/components/ui/Layout/Layout"

import { Winamp } from "@/src/entity/winamp"

const App: NextPage<AppProps> = ({ Component, pageProps, router }) => {
    const scope = useScope(pageProps.initialState)
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
    )
}

export default App
