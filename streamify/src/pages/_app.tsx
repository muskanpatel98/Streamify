import Header from "@/components/ui/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/ui/Sidebar";
import { Toaster } from "sonner";
import {UserProvider} from "../lib/AuthContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
  <div className="min-h-screen bg-white text-black">
    <Header/>
    <div className="flex">
      <Sidebar/>
      <Toaster/>
    <Component {...pageProps} />
    </div>
    </div>
    </UserProvider>
  )
}
