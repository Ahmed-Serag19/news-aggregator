import { useEffect, useState } from "react";
import { useNews } from "@/context/NewsProvider";
import { useSearchArticles } from "@/api/newsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, ChevronUp, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const removeDuplicates = <T,>(array: T[], key: keyof T) => {
  return Array.from(new Map(array.map((item) => [item[key], item])).values());
};

export function SearchFilters() {
  const { filters, setFilters, setSearchResults, sources, categories } =
    useNews();
  const [isExpanded, setIsExpanded] = useState(false);
  const [sourceSearch, setSourceSearch] = useState("");

  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(sourceSearch.toLowerCase())
  );

  const {
    data: searchResults,
    refetch: refetchSearch,
    isFetching,
  } = useSearchArticles(filters.query, filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.query.length > 2 || filters.category || filters.source) {
        console.log("Triggering search with filters:", filters);
        refetchSearch();
      }
    }, 1500);

    return () => clearTimeout(handler);
  }, [filters, refetchSearch]);

  useEffect(() => {
    if (searchResults) {
      console.log(`Setting ${searchResults.length} search results`);
      setSearchResults(searchResults);
    }
  }, [searchResults, setSearchResults]);

  const handleDateRange = (range: { from?: Date; to?: Date }) => {
    console.log("Date range selected:", range);
    setFilters({
      ...filters,
      dateFrom: range?.from ? range.from.toISOString() : "",
      dateTo: range?.to ? range.to.toISOString() : "",
    });

    setTimeout(() => {
      refetchSearch();
    }, 100);
  };

  const uniqueCategories = removeDuplicates(categories, "id");
  const uniqueSources = removeDuplicates(sources, "id");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Hide Filters</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Show Filters</span>
              </>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                value={filters.query}
                onChange={(e) =>
                  setFilters({ ...filters, query: e.target.value })
                }
                placeholder="Search articles..."
                className="border rounded-lg p-2 w-full"
              />
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                value={filters.source}
                onValueChange={(value) =>
                  setFilters({ ...filters, source: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search sources..."
                      value={sourceSearch}
                      onChange={(e) => setSourceSearch(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.length > 0 ? (
                    filteredSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500 text-sm">
                      No sources found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full overflow-x-auto h-12 justify-start text-left font-normal",
                        (!filters.dateFrom || !filters.dateTo) &&
                          "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom && filters.dateTo
                        ? `${format(
                            new Date(filters.dateFrom),
                            "PPP"
                          )} - ${format(new Date(filters.dateTo), "PPP")}`
                        : "Select date range"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.dateFrom
                        ? new Date(filters.dateFrom)
                        : undefined,
                      to: filters.dateTo ? new Date(filters.dateTo) : undefined,
                    }}
                    onSelect={(range) =>
                      handleDateRange(
                        range || { from: undefined, to: undefined }
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="mt-4 text-right">
          <Button
            onClick={() => {
              console.log("Manual search triggered");
              refetchSearch();
            }}
            disabled={isFetching}
          >
            {isFetching ? (
              "Searching..."
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Search
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
