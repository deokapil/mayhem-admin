"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  perPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  perPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Generate pagination links
  const generatePageLinks = () => {
    const links = [];

    // Previous page button
    links.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) {
              updatePage(currentPage - 1);
            }
          }}
          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // First page
    links.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            updatePage(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis or pages
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 2; i < totalPages; i++) {
        links.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                updatePage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis for many pages
      if (currentPage > 3) {
        links.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        links.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                updatePage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        links.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Last page (if more than 1 page)
    if (totalPages > 1) {
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              updatePage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next page button
    links.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
              updatePage(currentPage + 1);
            }
          }}
          className={
            currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return links;
  };

  // Update URL with new page
  const updatePage = (page: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", page.toString());
    searchParams.set("per_page", perPage.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationComponent>
      <PaginationContent>{generatePageLinks()}</PaginationContent>
    </PaginationComponent>
  );
}
