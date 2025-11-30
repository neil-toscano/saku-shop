import { montserratAlternate } from "@/config/fonts";
import { Suspense } from "react";
import { LoginForm } from "./ui/LoginForm";

export default function Auth() {
  return (
    <main className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${montserratAlternate.className} text-4xl mb-5`}>
        Ingresar
      </h1>

      <Suspense fallback={<div>Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
