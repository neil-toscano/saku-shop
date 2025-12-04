import { montserratAlternate } from "@/config/fonts";
import { Suspense } from "react";
import { LoginForm } from "./ui/LoginForm";

export default function Auth() {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center">
      <div className="bg-stone-100 p-2 rounded mb-5 shadow-xl">
        <h1 className={`${montserratAlternate.className} text-4xl mb-5`}>
          Ingresar
        </h1>

        <Suspense fallback={<div>Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
