import * as z from "zod";

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const ProductFormSchema = z.object({
  id: z.string().uuid("El ID no es un UUID válido").optional().nullable(),
  title: z
    .string()
    .trim()
    .min(3, { error: "El titulo debe tener almenos 3 caracteres" }),
  slug: z.string().trim().min(3).transform(slugify),
  description: z
    .string()
    .trim()
    .min(3, { error: "La descripcion debe tener almenos 3 caracteres." }),
  price: z.coerce
    .number()
    .min(0, { error: "No puede ser menor a 0" })
    .transform((val) => Number(val.toExponential(2))),
  inStock: z.coerce.number().min(0, { error: "No puede ser menor a 0" }),
  sizes: z
    .string()
    .transform((val) => val.split(","))
    .transform((arr) => arr.map((s) => s.trim()))
    .refine((arr) => arr.length > 0 && arr[0] !== ""),
  gender: z.enum(["men", "women", "kid", "unisex"], {
    error: "Debe ser un genero permitido",
  }),
  tags: z
    .string()
    .transform((val) => val.split(","))
    .transform((arr) => arr.map((s) => s.trim()))
    .refine((arr) => arr.length > 0 && arr[0] !== ""),
  categoryId: z.string().uuid("El ID no es un UUID válido"),
});
