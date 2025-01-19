// src/components/FilterPopup.tsx
import React, { useState } from 'react';

interface FilterPopupProps {
    isOpen: boolean;
    onClose: (filters: { category: string; position: string }) => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPosition, setSelectedPosition] = useState("");

    if (!isOpen) return null;

    const handleApplyFilters = () => {
        onClose({ category: selectedCategory, position: selectedPosition });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => onClose({ category: selectedCategory, position: selectedPosition })}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-11/12 md:w-1/3">
                <h2 className="text-lg font-bold mb-4">Filter Options</h2>

                {/* Categories */}
                <div className="mb-4">
                    <h3 className="font-semibold">Categories</h3>
                    <div className="flex flex-col">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="all"
                                checked={selectedCategory === "all"}
                                onChange={() => setSelectedCategory("all")}
                                className="mr-2"
                            />
                            All
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="hitters"
                                checked={selectedCategory === "hitters"}
                                onChange={() => setSelectedCategory("hitters")}
                                className="mr-2"
                            />
                            Hitters
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                value="pitchers"
                                checked={selectedCategory === "pitchers"}
                                onChange={() => setSelectedCategory("pitchers")}
                                className="mr-2"
                            />
                            Pitchers
                        </label>
                    </div>
                </div>

                {/* Position Filter */}
                <div className="mb-4">
                    <h3 className="font-semibold">Position</h3>
                    <select
                        className="border rounded p-2 w-full"
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="OF">Outfield</option>
                        <option value="1B">First Base</option>
                        <option value="SP">Starting Pitcher</option>
                        {/* Add more positions as needed */}
                    </select>
                </div>

                {/* Apply Filters Button */}
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleApplyFilters}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterPopup;