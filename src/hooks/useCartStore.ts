import { create } from 'zustand';
import { currentCart } from '@wix/ecom';
import { WixClient } from '@/context/wixContext';

type CartItem = {
  _id: string;
  productName: { original: string };
  price: { amount: string };
  quantity: number;
  availability?: { status: string };
  image?: string;
};

type Cart = {
  lineItems: CartItem[];
  subtotal: {
    amount: string;
    convertedAmount: string;
    formattedAmount: string;
    formattedConvertedAmount: string;
  };
  currency: string;
  conversionCurrency: string;
};

type CartState = {
  cart: Cart | null;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => void;
  addItem: (wixClient: WixClient, productId: string, variantId: string, quantity: number) => void;
  removeItem: (wixClient: WixClient, itemId: string) => void;
  clearCart: () => void; // Ensure `clearCart` is typed and added here
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: true,
  counter: 0,
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      if (cart) {
        set({
          cart: cart as Cart, 
          isLoading: false,
          counter: cart.lineItems?.length || 0,
        });
      } else {
        set({
          cart: null,
          isLoading: false,
          counter: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({
        cart: null,
        isLoading: false,
        counter: 0,
      });
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity: quantity,
          },
        ],
      });
      set({
        cart: response.cart as Cart,
        counter: response.cart?.lineItems.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      set({
        isLoading: false,
      });
    }
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true }));
    try {
      const response = await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
      set({
        cart: response.cart as Cart,
        counter: response.cart?.lineItems.length || 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({
        isLoading: false,
      });
    }
  },
  clearCart: () => {
    set({ cart: null, counter: 0 });
  },
}));
