import Image from "next/image";
import { auth } from "../../../../auth";

export default async function ProfilePage() {
  const session = await auth();

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-56 w-72 absolute flex justify-center items-center">
        <Image
          width={80}
          height={80}
          className="object-cover h-20 w-20 rounded-full"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
          alt=""
        />
      </div>

      <div
        className="
          h-56
          mx-4
          w-5/6
          bg-blue-400
          rounded-3xl
          shadow-md
          sm:w-80 sm:mx-0
        "
      >
        <div className="h-1/2 w-full flex justify-between items-baseline px-3 py-5">
          <h1 className="text-white">Profile</h1>
        </div>

        <div
          className="
            bg-white
            h-1/2
            w-full
            rounded-3xl
            flex flex-col
            justify-around
            items-center
          "
        >
          <div className="w-full h-1/2 flex justify-between items-center px-3 pt-2">
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-gray-500 text-xs">Orders</h1>
              <h1 className="text-gray-600 text-sm">5</h1>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-gray-500 text-xs">Spent</h1>
              <h1 className="text-gray-600 text-sm">$2,004</h1>
            </div>
          </div>
          <div className="w-full h-1/2 flex flex-col justify-center items-center">
            <h1 className="text-gray-700 font-bold">{session?.user?.name}</h1>
            <h1 className="text-gray-500 text-sm">{session?.user?.email}</h1>
            <h1 className="text-gray-500 text-sm mb-5">
              Rol: {session?.user?.role}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
