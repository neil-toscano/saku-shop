"use client";

import { createProduct, deleteProductImage } from "@/actions";
import { ProductImageCustom } from "@/components";
import { Category, Product, ProductImage } from "@/interfaces";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  product: Partial<Product> & { productImages?: ProductImage[] }; //todo: revisar*curiosidad
  categories: Category[];
}

type FormInputs = {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  gender: "men" | "women" | "kid" | "unisex";
  categoryId: string;
  images: FileList;
};

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(","),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });
  console.log(errors, "err");
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (data.sizes.length === 0) {
      setError(
        "sizes",
        {
          type: "required",
          message: "Debe seleccionar al menos una talla.",
        },
        { shouldFocus: false }
      );
      return;
    }

    const formData = new FormData();

    const { images, ...productToSave } = data;

    if (product.id) {
      formData.append("id", product.id);
    }

    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug.toLowerCase());
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("gender", productToSave.gender);

    if (images) {
      for (let index = 0; index < images.length; index++) {
        formData.append("images", images[index]);
      }
    }

    const { ok, product: _product } = await createProduct(formData);
    if (!ok) {
      toast.error("Ocurrió un error", {
        position: "top-center",
        style: { backgroundColor: "#FB2C36", color: "white" },
      });
    } else {
      toast.success("Actualizado correctamente", {
        position: "top-center",
        style: { backgroundColor: "#31D492", color: "white" },
      });
      router.replace(`/admin/product/${_product?.slug}`);
    }
  };

  // ProductForm.tsx (Función onSizechange corregida)

  const onSizechange = (size: string) => {
    const currentSizes = getValues("sizes");
    const includeSize = currentSizes.includes(size);

    let newSizes: string[];

    if (includeSize) {
      newSizes = currentSizes.filter((s) => s !== size);
    } else {
      newSizes = [...currentSizes, size];
    }

    setValue("sizes", newSizes, { shouldValidate: true });

    if (newSizes.length > 0) {
      clearErrors("sizes");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-3">
          <span>Título</span>
          <input
            defaultValue="Titulo"
            {...register("title", { required: true, minLength: 3 })}
            type="text"
            className="p-2 border rounded-md bg-white"
          />
          {errors.title && (
            <span className="text-red-600">Longitud mínima 3</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            {...register("slug", { required: true, minLength: 3 })}
            type="text"
            className="p-2 border rounded-md bg-white"
          />
          {errors.slug && (
            <span className="text-red-600">Longitud mínima 3</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            {...register("description", { required: true, minLength: 3 })}
            rows={5}
            className="p-2 border rounded-md bg-white"
          ></textarea>
          {errors.description && (
            <span className="text-red-600">Longitud mínima 3</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            {...register("price", { required: true, min: 0 })}
            type="number"
            className="p-2 border rounded-md bg-white"
          />
          {errors.price && <span className="text-red-600">Valor mínimo 0</span>}
        </div>

        <div className="flex flex-col mb-2">
          <span>inStock</span>
          <input
            {...register("inStock", { required: true, min: 0 })}
            type="number"
            className="p-2 border rounded-md bg-white"
          />
          {errors.inStock && (
            <span className="text-red-600">Valor mínimo 0</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            {...register("tags", { required: true })}
            type="text"
            className="p-2 border rounded-md bg-white"
          />
          {errors.tags && <span className="text-red-600">Escriba el tag</span>}
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            {...register("gender", { required: true })}
            className="p-2 border rounded-md bg-white"
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
          {errors.gender && (
            <span className="text-red-600">Seleccione el género</span>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            {...register("categoryId", { required: true })}
            className="p-2 border rounded-md bg-white"
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <span className="text-red-600">Seleccione la categoría</span>
          )}
        </div>

        <button type="submit" className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                className={clsx(
                  "cursor-pointer flex  items-center justify-center w-10 h-10 mr-2 border rounded-md",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
                onClick={() => onSizechange(size)}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>
          {errors.sizes && (
            <span className="text-red-600 mt-1">
              {errors.sizes.message || "Debe seleccionar al menos una talla."}
            </span>
          )}

          <div className="flex flex-col mb-2">
            <span>Fotos</span>
            <input
              {...register("images")}
              type="file"
              multiple
              className="p-2 border rounded-md bg-white"
              accept="image/png, image/jpeg, image.avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.productImages?.map((image) => (
              <div key={image.id}>
                <ProductImageCustom
                  alt={product.title ?? ""}
                  src={image.url}
                  width={300}
                  height={300}
                  className="w-80 h-80 rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={() => deleteProductImage(image.id, image.url)}
                  className="cursor-pointer btn-danger w-full rounded-b-xl"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
