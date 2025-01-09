import { createClient, OAuthStrategy } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
    const cookies = request.cookies;
    const response = NextResponse.next();

    // Check if the refreshToken cookie already exists
    if (cookies.get("refreshToken")) {
        return response;
    }

    // Initialize Wix Client to generate visitor tokens
    const wixClient = createClient({
        auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID! }),
    });

    const tokens = await wixClient.auth.generateVisitorTokens();

    // Set the refreshToken as a cookie
    response.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });

    return response;
};
