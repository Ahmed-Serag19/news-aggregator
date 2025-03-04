import { Link, useLocation } from "react-router-dom";
import { Search, Home, Settings } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky bg-black text-white top-0 z-50 w-full shadow-2xl">
      <div className="container flex h-14 items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl mr-6">
          <span className="text-white">NewsAgg</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className={`font-medium flex items-center gap-1 ${
              location.pathname === "/" ? "text-blue-300" : "text-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="/search"
            className={`font-medium flex items-center gap-1 ${
              location.pathname === "/search" ? "text-blue-300" : "text-white"
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link
            to="/preferences"
            className={`font-medium flex items-center gap-1 ${
              location.pathname === "/preferences"
                ? "text-blue-300"
                : "text-white"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
