import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { memo, ReactNode } from "react";

import { Header } from "~/widgets/header/view";

import { Sidebar } from "@/src/widgets/sidebar/view";

const WinampLayoutButton = dynamic(
  import("@/components/ui/winamp-layout-button").then((mod) => mod.WinampLayoutButton),
  {
    ssr: false,
  },
);

interface LayoutProps {
  children: ReactNode;
}

export const Layout = memo<LayoutProps>(({ children }) => {
  return (
    <>
      <Head>
        <title>Музыкалка </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Header />
      <Sidebar />
      {children}

      <WinampLayoutButton />

      <footer className="grid grid-cols-12 items-center bg-gray-400 px-8 py-4 text-xl">
        <Link href="/" shallow>
          <a className="col-span-6 flex items-center text-xl sm:col-span-3">
            <Image src="/img/winamp-logo.svg" height={50} width={50} alt="Лого" />
            <h2>Шinamp</h2>
          </a>
        </Link>
      </footer>

      {/* <MobileNavPanel />
        <Footer /> */}
    </>
  );
});

Layout.displayName = "Layout";
