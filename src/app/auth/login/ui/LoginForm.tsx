"use client";

import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/actions";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import clsx from "clsx";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction}>
      <div className="flex flex-col">
        <label htmlFor="email">Correo electrónico</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          name="email"
          type="email"
          required={true}
          // value={"test3@gmail.com"}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          name="password"
          type="password"
          minLength={8}
          required={true}
          // value={"12345678"}
        />

        <div
          className="flex h-8 items-end space-x-1 mb-4"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <IoCloseCircleOutline className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button
          type="submit"
          className={clsx("flex justify-center items-center gap-2 mt-5", {
            "btn-primary cursor-pointer": !isPending,
            "btn-loading": isPending,
          })}
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Ingresar
        </button>

        {/* divisor l ine */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth/new-account"
          className="btn-secondary text-center border-2 border-black"
        >
          Crear una nueva cuenta
        </Link>
      </div>
    </form>
  );
};
