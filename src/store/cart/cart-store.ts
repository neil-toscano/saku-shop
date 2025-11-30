import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { CartProduct } from "../../interfaces/product.interface";

interface CartState {
  cart: CartProduct[];
  getTotalItems: () => number;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;

  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    devtools((set, get) => ({
      cart: [],
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },
      addProductToCart: (newProduct: CartProduct) =>
        set((state) => {
          const productIncart = state.cart.some(
            (item) => item.id === newProduct.id && item.size === newProduct.size
          );

          if (!productIncart) {
            return {
              cart: [...state.cart, newProduct],
            };
          }

          //   2. Existe el producto por talla
          const updatedCartProduct = state.cart.map((item) => {
            if (item.id === newProduct.id && item.size === newProduct.size) {
              return {
                ...item,
                quantity: item.quantity + newProduct.quantity,
              };
            }
            return item;
          });

          return {
            cart: updatedCartProduct,
          };
        }),

      updateProductQuantity: (newProduct, quantity) =>
        set((state) => {
          const productIncart = state.cart.some(
            (item) => item.id === newProduct.id && item.size === newProduct.size
          );

          if (!productIncart) {
            return {
              cart: [...state.cart],
            };
          }

          //   2. Existe el producto por talla
          const updatedCartProduct = state.cart.map((item) => {
            if (item.id === newProduct.id && item.size === newProduct.size) {
              return {
                ...item,
                quantity: quantity,
              };
            }
            return item;
          });

          return {
            cart: updatedCartProduct,
          };
        }),
      removeProduct: (product: CartProduct) =>
        set((state) => {
          const productIncart = state.cart.some(
            (item) => item.id === product.id && item.size === product.size
          );

          if (!productIncart) {
            return {
              cart: [...state.cart],
            };
          }

          //   2. Existe el producto por talla
          const updatedCartProduct = state.cart.filter(
            (item) => !(item.id === product.id && item.size === product.size)
          );

          return {
            cart: updatedCartProduct,
          };
        }),
      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal,
          0
        );

        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },
      clearCart: () => set({ cart: [] }),
    })),
    {
      name: "persistent-cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
