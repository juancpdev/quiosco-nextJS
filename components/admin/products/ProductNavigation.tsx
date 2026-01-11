import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import React from "react";

type pageNavigationType = {
  page: number;
  totalPages: number;
};

export default function ProductNavigation({
  page,
  totalPages,
}: pageNavigationType) {
  return (
    <nav className="flex justify-center pt-10 ">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="bg-white rounded-md px-4 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
        >
          <ChevronsLeft />
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          className=
            {`rounded-md px-4 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 
                ${i + 1 === page ? 'bg-orange-300' : 'bg-white'}
                `}
          key={i}
          href={`?page=${i + 1}`}
        >
          {i + 1}
        </Link>
      ))}

      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="bg-white rounded-md px-4 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0"
        >
          <ChevronsRight />
        </Link>
      )}
    </nav>
  );
}
