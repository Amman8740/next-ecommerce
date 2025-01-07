"use client"

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie"
import { createContext, ReactNode } from "react";
import { redirects } from "@wix/redirects";

const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}")

const WixClient = createClient({
    modules: {
      products,
      collections,
      currentCart,
      redirects
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken,
        accessToken: {value: "", expiresAt: 0}
      },
    }),
  });
  
  export type WixClient = typeof WixClient
  export const WixClientContext = createContext<WixClient>(WixClient)

  export const WixClientContextProvider = ({children}:{children:ReactNode})=>{
    return(
        <WixClientContext.Provider value={WixClient}>{children}</WixClientContext.Provider>
    )
  }