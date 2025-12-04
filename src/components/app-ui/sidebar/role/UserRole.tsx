import Link from "next/link";
import { IoPersonOutline, IoTicketOutline } from "react-icons/io5";

interface Props {
  closeSidebar: () => void;
}
export const UserRole = ({ closeSidebar }: Props) => {
  return (
    <div>
      <Link
        href={"/profile"}
        onClick={closeSidebar}
        className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoPersonOutline size={30} />
        <span className="ml-3 text-xl">Perfil</span>
      </Link>

      <Link
        href={"/orders"}
        onClick={closeSidebar}
        className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={30} />
        <span className="ml-3 text-xl">Mis Compras</span>
      </Link>
    </div>
  );
};
