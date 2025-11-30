"use client";

import { changeUserRole } from "@/actions";
import type { User } from "@/interfaces";
import { toast } from "sonner";

interface Props {
  users: User[];
}
export default function UsersPage({ users }: Props) {
  const onChangeRole = async (userId: string, role: string) => {
    const validRole = role === "user" ? "user" : "admin";
    toast.success("Rol cambiado", {
      position: "top-center",
      style: { backgroundColor: "#2B7FFF", color: "white" },
    });
    await changeUserRole(userId, validRole);
  };

  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b border-gray-300">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            #ID
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Nombre completo
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            Rol
          </th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user, index) => (
          <tr
            key={user.id}
            className="bg-white border-b border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {index}
            </td>
            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {user.email}
            </td>
            <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
              {user.name}
            </td>
            <td className="text-sm text-gray-900 font-light px-6">
              <select
                className="text-sm w-full min-w-24 p-2 text-gray-900 border border-gray-200 rounded-lg"
                value={user.role}
                onChange={(e) => onChangeRole(user.id, e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
