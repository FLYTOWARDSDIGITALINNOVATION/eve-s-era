import React, { useState } from "react";
import { FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import "./AdminSizeSelector.css";

const STANDARD_SIZES = ["S", "M", "L", "XL", "XXL"];
const EXCLUDED_SIZES = new Set(["XS", "3XL", "FREE SIZE", "FREESIZE"]);

const AdminSizeSelector = ({ value = "", onChange }) => {
  const [customSize, setCustomSize] = useState("");

  // Parse incoming value into an array of clean size strings, excluding XS, 3XL, Free Size
  const parseSizes = (val) => {
    if (!val) return [];
    let list = [];
    if (Array.isArray(val)) {
      list = val.flatMap(s => typeof s === "string" ? s.split(",") : s).map(s => String(s).trim()).filter(Boolean);
    } else if (typeof val === "string") {
      list = val.split(",").map(s => s.trim()).filter(Boolean);
    }
    return list.filter(s => !EXCLUDED_SIZES.has(s.toUpperCase()));
  };

  const selectedSizes = parseSizes(value);

  const updateSizes = (newSizes) => {
    // Keep clean unique sizes
    const unique = Array.from(new Set(newSizes.map(s => s.trim()).filter(Boolean)));
    if (onChange) {
      onChange(unique.join(", "));
    }
  };

  // Toggle standard pill size
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      updateSizes(selectedSizes.filter((s) => s !== size));
    } else {
      updateSizes([...selectedSizes, size]);
    }
  };

  // Add from dropdown
  const handleDropdownSelect = (e) => {
    const size = e.target.value;
    if (size && !selectedSizes.includes(size)) {
      updateSizes([...selectedSizes, size]);
    }
    e.target.value = "";
  };

  // Add custom size
  const handleAddCustom = (e) => {
    if (e) e.preventDefault();
    const trimmed = customSize.trim().toUpperCase();
    if (trimmed && !EXCLUDED_SIZES.has(trimmed) && !selectedSizes.includes(trimmed)) {
      updateSizes([...selectedSizes, trimmed]);
      setCustomSize("");
    }
  };

  // Select all standard S - XXL
  const handleSelectAllStandard = () => {
    const merged = Array.from(new Set([...selectedSizes, ...STANDARD_SIZES]));
    updateSizes(merged);
  };

  // Clear all sizes
  const handleClearAll = () => {
    updateSizes([]);
  };

  return (
    <div className="admin-size-selector-wrap">
      <div className="admin-size-header-row">
        <span className="admin-size-lbl">Available Sizes (S, M, L, XL, XXL)</span>
        <div className="admin-size-presets">
          <button
            type="button"
            className="preset-btn"
            onClick={handleSelectAllStandard}
            title="Select all standard sizes S to XXL"
          >
            ✓ All S – XXL
          </button>
          <button
            type="button"
            className="preset-btn clear"
            onClick={handleClearAll}
            title="Clear all selected sizes"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Quick Toggle Buttons strictly for S, M, L, XL, XXL */}
      <div className="admin-size-pills-row">
        {STANDARD_SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);
          return (
            <button
              key={size}
              type="button"
              className={`size-pill-btn ${isSelected ? "active" : ""}`}
              onClick={() => toggleSize(size)}
            >
              {isSelected && <FaCheck className="check-mark" />}
              <span>{size}</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown & Custom Size Input */}
      <div className="admin-size-inputs-row">
        <select
          className="admin-size-dropdown"
          onChange={handleDropdownSelect}
          defaultValue=""
        >
          <option value="" disabled>
            ➕ Pick size from dropdown (S – XXL)...
          </option>
          {STANDARD_SIZES.map((size) => (
            <option
              key={size}
              value={size}
              disabled={selectedSizes.includes(size)}
            >
              {size} {selectedSizes.includes(size) ? "(Already selected)" : ""}
            </option>
          ))}
        </select>

        <div className="admin-custom-size-box">
          <input
            type="text"
            className="admin-custom-input"
            placeholder="Custom size (e.g. 32)"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
          <button
            type="button"
            className="admin-custom-add-btn"
            onClick={handleAddCustom}
          >
            <FaPlus size={10} /> Add
          </button>
        </div>
      </div>

      {/* Summary of what will be shown to customers */}
      <div className="admin-selected-summary">
        <span className="summary-tag-label">Selected:</span>
        {selectedSizes.length > 0 ? (
          selectedSizes.map((s) => (
            <span key={s} className="selected-size-chip">
              {s}
              <button
                type="button"
                className="chip-remove-btn"
                onClick={() => updateSizes(selectedSizes.filter((x) => x !== s))}
                title={`Remove ${s}`}
              >
                <FaTimes size={10} />
              </button>
            </span>
          ))
        ) : (
          <span className="no-sizes-hint">
            No sizes chosen yet. Click S, M, L, XL, XXL above to enable them.
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminSizeSelector;
