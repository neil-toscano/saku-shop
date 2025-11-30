"use client";

import { setUserAddress } from "@/actions";
import { deleteUserAddress } from "@/actions/address/delete-user-address";
import { Address, Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";

type Inputs = {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
};

interface Props {
  countries: Country[];
  session: Session | null;
  userDbAddress?: Partial<Address>;
}

export const AddressForm = ({
  countries,
  session,
  userDbAddress = {},
}: Props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      ...userDbAddress,
      rememberAddress: true,
    },
  });

  const setAddress = useAddressStore(useShallow((state) => state.setAddress));
  const address = useAddressStore((state) => state.address);

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //local storage
    setAddress({
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      country: data.country,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      postalCode: data.postalCode,
    });

    //db
    if (data.rememberAddress && session?.user.id) {
      await setUserAddress(
        {
          address1: data.address1,
          address2: data.address2,
          city: data.city,
          country: data.country,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          postalCode: data.postalCode,
        },
        session?.user.id
      );
    }
    if (!data.rememberAddress && session?.user) {
      await deleteUserAddress(session?.user.id);
    }
    router.push("/checkout");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-1">
        <span>Nombres</span>
        <input
          {...register("firstName", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.firstName && (
          <span className="text-red-700 mb-3">El nombre es obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input
          {...register("lastName", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.lastName && (
          <span className="text-red-700 mb-3">El Apellido es obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input
          {...register("address1", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.lastName && (
          <span className="text-red-700 mb-3">La dirección es obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección 2 (opcional)</span>
        <input
          {...register("address2")}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Código postal</span>
        <input
          {...register("postalCode", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.postalCode && (
          <span className="text-red-700 mb-3">Código postal obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input
          {...register("city", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.city && (
          <span className="text-red-700 mb-3">Ciudad obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>País</span>
        <select
          {...register("country", { required: true })}
          className="p-2 border rounded-md bg-gray-200"
        >
          <option value="">[ Seleccione ]</option>
          {countries.map((country) => (
            <option key={country.code} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className="text-red-700 mb-3">Pais obligatorio</span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono</span>
        <input
          {...register("phone", { required: true, minLength: 2 })}
          type="text"
          className="p-2 border rounded-md bg-gray-200"
        />
        {errors.phone && (
          <span className="text-red-700 mb-3">Teléfono obligatorio</span>
        )}
      </div>
      {/* //checkbox */}
      <div className="inline-flex items-center">
        <label
          className="relative flex cursor-pointer items-center rounded-full p-3"
          htmlFor="checkbox"
        >
          <input
            {...register("rememberAddress")}
            type="checkbox"
            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
            id="checkbox"
          />
          <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </label>
        <span>Recordar dirección</span>
      </div>
      <div className="flex flex-col mb-2 sm:mt-10">
        <button
          className="cursor-pointer btn-primary flex w-full sm:w-1/2 justify-center "
          type="submit"
          //   className={clsx({
          //     "btn-primary": isValid,
          //     "btn-disable": !isValid,
          //   })}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
