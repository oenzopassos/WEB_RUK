import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthRedirect } from "@/contexts/AuthRedirect";

export default function App({ Component, pageProps }: AppProps) {

  

  return (
    <AuthProvider>
      <AuthRedirect />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
