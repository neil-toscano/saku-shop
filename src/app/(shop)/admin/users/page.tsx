import { Title } from "@/components";
import { ErrorCodes } from "@/constants";

import { redirect } from "next/navigation";
import UsersPage from "./ui/Users";
import { getUsers } from "@/actions";

export default async function OrdersPage() {
  const { ok, message, code, users = [] } = await getUsers();

  if (!ok && code === ErrorCodes.AUTH_FORBIDDEN) {
    redirect("/auth/login");
  }

  if (!ok) return <h1>{message}</h1>;

  return (
    <>
      <Title title="Todos los usuarios" />

      <div className="mb-10 overflow-x-auto">
        <UsersPage users={users} />
      </div>
    </>
  );
}
