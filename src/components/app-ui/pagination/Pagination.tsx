"use client";
import { generatePagination } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageString = searchParams.get("page") ?? 1;

  let currentPage = isNaN(+pageString) ? 1 : +pageString;
  if (currentPage < 1) {
    currentPage = 1;
  }

  const allPages = generatePagination(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams); //page=50

    if (pageNumber === "...") {
      return `${pathname}?${params.toString()}`;
    }

    if (+pageNumber === 0) {
      return `${pathname}`;
    }

    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex text-center justify-center mt-10 mb-32">
        <nav aria-label="Page navigation example">
          <ul className="flex list-style-none">
            <li className="page-item active">
              <Link
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                href={createPageUrl(currentPage - 1)}
              >
                <IoChevronBack size={30} />
              </Link>
            </li>

            {allPages.map((page, index) => (
              <li key={page + "_" + index} className="page-item">
                <Link
                  className={clsx(
                    "page-link relative block py-1.5 px-3  border-0  outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-amber-100 focus:shadow-none",
                    {
                      "bg-blue-500 shadow-md text-white": page == currentPage,
                    }
                  )}
                  href={createPageUrl(page)}
                >
                  {page}
                </Link>
              </li>
            ))}

            <li className="page-item">
              <Link
                className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                href={createPageUrl(currentPage + 1)}
              >
                <IoChevronForward size={30} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
