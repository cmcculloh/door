import "/node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css";

import "@/styles/globals.scss";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
