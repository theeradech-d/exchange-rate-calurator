import Head from "next/head";
import Navbar from "./navbar";

export default function Layout({ children, appConfig, menus }) {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Exchange Rate Tool</title>
            </Head>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
