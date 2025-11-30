"use server";

import prisma from "@/lib/prisma";
import { FormState, SignupFormSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { signIn } from "../../../auth";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If any form fields are invalid, return early
  console.log(validatedFields.error?.flatten().fieldErrors);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const emailExists = await prisma.user.findUnique({
    where: {
      email: validatedFields.data.email,
    },
  });
  if (emailExists)
    return {
      errors: {
        email: ["El correo ya existe"],
      },
    };

  const salt = bcrypt.genSaltSync(10);

  const user = await prisma.user.create({
    data: {
      email: validatedFields.data.email,
      name: validatedFields.data.name,
      password: bcrypt.hashSync(validatedFields.data.password, salt),
    },
  });

  //?que pasa si un admin crea
  await signIn("credentials", {
    email: validatedFields.data.email, // Usamos el email recién registrado
    password: validatedFields.data.password, // Usamos la contraseña que acaba de ingresar
    redirect: false, // ⬅️ IMPORTANTE: Evita que signIn haga una redirección de Auth.js
  });
  redirect("/profile");
}
