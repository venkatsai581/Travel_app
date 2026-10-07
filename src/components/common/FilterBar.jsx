import {
  SlidersHorizontal
} from "lucide-react";

function FilterBar({
  children,
  onReset,
  showReset = false
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-title">
        <SlidersHorizontal size={17} />

        <span>
          Filters
        </span>
      </div>

      <div className="filter-controls">
        {children}
      </div>

      {showReset && (
        <button
          type="button"
          className="reset-filter-button"
          onClick={onReset}
        >
          Reset
        </button>
      )}
    </div>
  );
}

export default FilterBar;