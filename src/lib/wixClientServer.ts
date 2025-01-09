import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { cookies } from "next/headers";

export const wixClientServer = async () => {
  try {
    const cookiesStore = cookies();
    const refreshTokenCookie = cookiesStore.get("refreshToken")?.value;

    if (!refreshTokenCookie) {
      console.error("Refresh token not found in cookies.");
      throw new Error("Missing refresh token.");
    }

    const refreshToken = JSON.parse(refreshTokenCookie);

    if (!refreshToken) {
      console.error("Invalid refresh token.");
      throw new Error("Invalid refresh token.");
    }

    const wixClient = createClient({
      modules: {
        products,
        collections,
      },
      auth: OAuthStrategy({
        clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "",
        tokens: {
          refreshToken,
          accessToken: { value: "", expiresAt: 0 }, // Placeholder, refreshToken will fetch a valid accessToken
        },
      }),
    });

    return wixClient;
  } catch (error) {
    console.error("Failed to initialize Wix Client:", error);
    throw new Error("Failed to initialize Wix Client.");
  }
};
