"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowUpDown, Search, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "use-debounce";
import { getSongsByFilter } from "../actions/songs";

interface SongListProps {
  page: number;
  perPage: number;
  sort: string;
  genre: string;
  search: string;
}

interface Column {
  id: string;
  label: string;
  sortable: boolean;
}

export async function SongList({
  page,
  perPage,
  sort,
  genre,
  search,
}: SongListProps) {
  // Fetch data using server action
  const { songs, totalSongs, totalPages } = await getSongs({
    page,
    perPage,
    sort,
    genre,
    search,
  });

  return (
    <div className="space-y-4">
      <SongFilters initialGenre={genre} initialSearch={search} />

      <Card>
        <CardContent className="p-0">
          <SongTable songs={songs} sort={sort} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {songs.length} of {totalSongs} songs
        </p>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          perPage={perPage}
        />
      </div>
    </div>
  );
}

function SongFilters({
  initialGenre,
  initialSearch,
}: {
  initialGenre: string;
  initialSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function SongTable({ songs, sort }: { songs: any[]; sort: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const columns: Column[] = [
    { id: "title", label: "Title", sortable: true },
    { id: "artist", label: "Artist", sortable: true },
    { id: "genre", label: "Genre", sortable: false },
    { id: "modifiedAt", label: "Last Modified", sortable: true },
    { id: "actions", label: "", sortable: false },
  ];

  // Handle sorting
  const handleSort = (columnId: string) => {
    const searchParams = new URLSearchParams(window.location.search);

    // Toggle between asc and desc if the same column is clicked
    const [currentColumn, currentDirection] = sort.split("-");
    const direction =
      currentColumn === columnId && currentDirection === "asc" ? "desc" : "asc";

    searchParams.set("sort", `${columnId}-${direction}`);
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  // Function to render sort indicator
  const renderSortIndicator = (columnId: string) => {
    const [currentColumn, currentDirection] = sort.split("-");

    if (currentColumn !== columnId) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return (
      <span className="ml-2 flex items-center">
        {currentDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id}>
              {column.sortable ? (
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                  {renderSortIndicator(column.id)}
                </button>
              ) : (
                column.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.length > 0 ? (
          songs.map((song) => (
            <TableRow key={song.id}>
              <TableCell className="font-medium">{song.title}</TableCell>
              <TableCell>{song.artist}</TableCell>
              <TableCell>
                <Badge variant="outline">{song.genre}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(song.modifiedAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <Link href={`/songs/${song.id}/edit`} passHref>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center h-24">
              No songs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
