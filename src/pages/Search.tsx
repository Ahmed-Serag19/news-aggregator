import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResults } from "@/components/search/SearchResults";

const Search = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Search Articles</h1>
      <SearchFilters />
      <SearchResults itemsPerPage={8} />
    </div>
  );
};

export default Search;
