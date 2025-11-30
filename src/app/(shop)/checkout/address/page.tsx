import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";
import { getCountries, getUserAddress } from "@/actions";
import { auth } from "../../../../../auth";

export default async function AddressPage() {
  const countries = await getCountries();

  const session = await auth();

  if (!session?.user) return <h1>Cargando...</h1>;

  const address = await getUserAddress(session?.user.id);

  const userDbAddress = {
    firstName: address?.firstName,
    lastName: address?.lastName,
    address1: address?.address1,
    address2: address?.address2 ?? undefined,
    postalCode: address?.postalCode,
    city: address?.city,
    country: address?.countryId,
    phone: address?.phone,
  };
  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm
          countries={countries}
          session={session}
          userDbAddress={userDbAddress}
        />
      </div>
    </div>
  );
}
