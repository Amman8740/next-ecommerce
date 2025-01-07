"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CartModel from "./CartModel";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const wixClient = useWixClient();

  useEffect(() => {
    setIsLoggedIn(wixClient.auth.loggedIn());
  }, [wixClient]);

  const handleProfile = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      Cookies.remove("refreshToken");


      const { logoutUrl } = await wixClient.auth.logout(window.location.href);
      setIsProfileOpen(false);
      setIsLoggedIn(false); 

 
      const { clearCart } = useCartStore.getState();
      clearCart(); // Reset cart using Zustand's clearCart method


      if (logoutUrl) {
        router.push(logoutUrl);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const { cart, counter, getCart } = useCartStore();
  useEffect(() => {
    if (isLoggedIn) {
      getCart(wixClient); 
    }
  }, [wixClient, getCart, isLoggedIn]);

  console.log("Cart:", cart);
  console.log("Is logged in:", isLoggedIn);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src={"/profile.png"}
        alt="Profile"
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          <Link href={"/profile"}>Profile</Link>
          <div className="mt-2 cursor-pointer" onClick={handleLogout}>
            {isLoading ? "Logging out..." : "Logout"}
          </div>
        </div>
      )}
      <Image
        src={"/notification.png"}
        alt="Notifications"
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image
          src={"/cart.png"}
          alt="Cart"
          width={22}
          height={22}
          className="cursor-pointer"
        />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModel />}
    </div>
  );
};

export default NavIcons;
