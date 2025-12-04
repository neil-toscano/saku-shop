import { montserratAlternate } from "@/config/fonts";
import { RegisterForm } from "./ui/RegisterForm";

export default function NewAccountPage() {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center">
      <div className="bg-stone-100 p-2 rounded mb-5  shadow-xl w-full md:w-[300px]">
        <h1 className={`${montserratAlternate.className} text-4xl mb-5`}>
          Nueva cuenta
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}
