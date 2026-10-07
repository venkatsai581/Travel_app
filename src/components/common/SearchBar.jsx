import {
  Search,
  X
} from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search..."
}) {
  return (
    <div className="search-bar">
      <Search size={18} />

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;