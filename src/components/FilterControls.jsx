export default function FilterControls({
  statusOptions,
  positionOptions,
  selectedStatus,
  selectedPosition,
  searchQuery,
  onStatusChange,
  onPositionChange,
  onSearchChange,
  onAddCandidate,
  addButtonText = "Add Candidate",
}) {
  return (
    <div className="filter-controls">
      <div className="filter-left">
        {statusOptions && (
          <select
            value={selectedStatus || "all"}
            onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {positionOptions && (
          <select
            value={selectedPosition || "all"}
            onChange={(e) => onPositionChange && onPositionChange(e.target.value)}
            className="filter-select"
          >
            {positionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="filter-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">
            <img src="./search.svg" alt="search" />
          </span>
        </div>

        {onAddCandidate && (
          <button className="add-button" onClick={onAddCandidate}>
            {addButtonText}
          </button>
        )}
      </div>

      <style>{`
        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .filter-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .filter-select {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 14px;
          background: white;
          cursor: pointer;
          font-family: inherit;
          height: 38px;
          box-sizing: border-box;
          min-width: 120px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #4d007d;
          box-shadow: 0 0 0 3px rgba(77, 0, 125, 0.1);
        }

        .filter-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          padding: 8px 16px 8px 40px;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          font-size: 14px;
          width: 250px;
          font-family: inherit;
          height: 38px;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #4d007d;
          box-shadow: 0 0 0 3px rgba(77, 0, 125, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        }

        .search-icon img {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }

        .add-button {
          background: #4d007d;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          height: 38px;
          box-sizing: border-box;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-button:hover {
          background: #6d28d9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(77, 0, 125, 0.3);
        }

        .add-button:active {
          transform: translateY(0);
        }

        /* Tablet styles */
        @media (max-width: 1024px) {
          .filter-controls {
            gap: 12px;
          }

          .search-input {
            width: 200px;
          }

          .filter-select {
            min-width: 100px;
          }
        }

        /* Mobile styles */
        @media (max-width: 768px) {
          .filter-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .filter-left {
            flex-direction: row;
            gap: 8px;
          }

          .filter-right {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .filter-select {
            flex: 1;
            min-width: 0;
          }

          .search-container {
            width: 100%;
          }

          .search-input {
            width: 100%;
          }

          .add-button {
            width: 100%;
          }
        }

        /* Small mobile styles */
        @media (max-width: 480px) {
          .filter-controls {
            gap: 12px;
            margin-bottom: 16px;
          }

          .filter-left {
            flex-direction: column;
            gap: 8px;
          }

          .filter-select {
            width: 100%;
          }

          .filter-right {
            gap: 8px;
          }

          .filter-select,
          .search-input,
          .add-button {
            height: 36px;
            font-size: 13px;
          }

          .search-input {
            padding: 6px 14px 6px 36px;
          }

          .search-icon {
            left: 12px;
            width: 14px;
            height: 14px;
          }

          .search-icon img {
            width: 14px;
            height: 14px;
          }

          .add-button {
            padding: 6px 16px;
          }

          .filter-select {
            padding: 6px 14px;
            padding-right: 36px;
          }
        }
      `}</style>
    </div>
  )
}
