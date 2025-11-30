import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AddressState {
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };

  setAddress: (address: AddressState["address"]) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    devtools((set) => ({
      address: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },
      setAddress: (newAddress: AddressState["address"]) =>
        set(() => {
          return {
            address: newAddress,
          };
        }),
    })),
    {
      name: "persistent-address-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
