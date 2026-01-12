import Heading from "@/components/ui/Heading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type SearchLayoutProps = {
  title: string;
  backHref: string;
  backLabel: string;
  searchForm: React.ReactNode;
  total: number;
  query: string;
  emptyMessage: string;
  children?: React.ReactNode;
};

export default function SearchLayout({
  title,
  backHref,
  backLabel,
  searchForm,
  total,
  query,
  emptyMessage,
  children,
}: SearchLayoutProps) {
  return (
    <>
      <Heading>{title}</Heading>

      <div className="mb-5 flex flex-col gap-5 items-center xl:flex-row xl:justify-between">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          <ArrowLeft size={20} />
          {backLabel}
        </Link>

        {searchForm}
      </div>

      <div className="mb-5 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          Mostrando <span className="font-bold">{total}</span>{" "}
          resultado{total !== 1 ? "s" : ""} para:{" "}
          <span className="font-bold text-indigo-600">"{query}"</span>
        </p>
      </div>

      {total === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
          <p className="text-gray-400 mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : (
        children
      )}
    </>
  );
}
