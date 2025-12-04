import Link from "next/link";
import {
  IoPeopleOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

interface Props {
  closeSidebar: () => void;
}

export const AdminRole = ({ closeSidebar }: Props) => {
  return (
    <div>
      <Link
        href={"/admin/products"}
        onClick={closeSidebar}
        className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoShirtOutline size={30} />
        <span className="ml-3 text-xl">Productos</span>
      </Link>

      <Link
        href={"/admin/orders"}
        onClick={closeSidebar}
        className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoTicketOutline size={30} />
        <span className="ml-3 text-xl">Ordenes</span>
      </Link>

      <Link
        href={"/admin/users"}
        onClick={closeSidebar}
        className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoPeopleOutline size={30} />
        <span className="ml-3 text-xl">Usuarios</span>
      </Link>
    </div>
  );
};
