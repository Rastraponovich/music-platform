import { NextPage } from "next"

import { Provider } from "effector-react/scope"
import { Scope } from "effector"

import { AppProps } from "next/app"
import Head from "next/head"

import "@/styles/globals.css"
import "tailwindcss/tailwind.css"
import { useScope } from "../hooks/useScope"
import Layout from "@/components/ui/Layout/Layout"
import AsidePlayer from "@/components/AsidePlayer/AsidePlayer"
import PlayList from "@/components/ui/PlayList/PlayList"

let clientScope: Scope

const App: NextPage<AppProps> = ({ Component, pageProps, router }) => {
    // const scope = fork({
    //     values: {
    //         ...(clientScope && serialize(clientScope)),
    //         ...pageProps.initialState,
    //     },
    // })
    // if (typeof window !== "undefined") clientScope = scope
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
                <AsidePlayer />
                <PlayList />
            </Layout>
        </Provider>
    )
}

export default App
