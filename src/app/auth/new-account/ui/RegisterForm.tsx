"use client";
import { signup } from "@/actions/auth/register";
import { Spinner } from "@/components/ui/spinner";
import clsx from "clsx";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [state, action, pending] = useActionState(signup, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (state?.errors.email) {
      toast.error(state.errors.email, {
        position: "top-center",
        style: { backgroundColor: "#FB2C36", color: "white" },
      });
    }
  }, [state]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="name">Nombre completo</label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-2"
            type="text"
            {...register("name", {
              minLength: 3,
              maxLength: 50,
              required: true,
            })}
          />

          {errors.name && (
            <span className="text-red-700 mb-1">El nombre es requerido</span>
          )}
          {state?.errors?.name && (
            <p className="text-red-700 mb-1">{state.errors.name}</p>
          )}

          <label className="mt-5" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="email"
            required={true}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-700">El email es requrido</span>
          )}

          <label htmlFor="email" className="mt-5">
            Contraseña
          </label>
          <input
            className="px-5 py-2 border bg-gray-200 rounded mb-5"
            type="text"
            {...register("password", { minLength: 8, required: true })}
          />
          {errors.password && (
            <span className="text-red-700">min. 8 caracteres</span>
          )}
          {state?.errors?.password && (
            <div>
              <p>Password must:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>- {error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className={clsx("flex justify-center items-center gap-2 mt-5", {
              "btn-primary cursor-pointer": !pending,
              "btn-loading": pending,
            })}
          >
            {pending && <Spinner />}
            {pending ? "Cargando..." : "Crear cuenta"}
          </button>

          {/* divisor l ine */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-500"></div>
            <div className="px-2 text-gray-800">O</div>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>

          <Link
            href="/auth/login"
            className="btn-secondary text-center border-2 border-black"
          >
            Ingresar
          </Link>
        </div>
      </form>
    </div>
  );
};
