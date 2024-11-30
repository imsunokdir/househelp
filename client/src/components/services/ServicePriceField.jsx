import React from "react";

const ServicePriceField = (params) => {
  const { formData, handlePriceRangeChange } = params;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label
          htmlFor="minPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Minimum Price
        </label>
        <input
          id="minPrice"
          name="minimum"
          type="number"
          value={formData.priceRange.minimum}
          onChange={handlePriceRangeChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Min price"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="maxPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Maximum Price
        </label>
        <input
          id="maxPrice"
          name="maximum"
          type="number"
          value={formData.priceRange.maximum}
          onChange={handlePriceRangeChange}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Max price"
        />
      </div>
    </div>
  );
};

export default ServicePriceField;
