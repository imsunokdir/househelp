import React from "react";
import { DollarSign } from "lucide-react";

const ServicePriceField = ({ formData, handlePriceRangeChange }) => {
  // Prevent scroll input changes
  const disableScroll = (e) => e.target.blur();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center border-b border-gray-100 pb-2 mb-4">
        <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
        <label className="text-sm font-medium text-gray-800">Price Range</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="minPrice"
            className="block text-xs font-medium text-gray-600"
          >
            Minimum Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
            <input
              id="minPrice"
              name="minimum"
              type="number"
              value={formData.priceRange.minimum}
              onChange={handlePriceRangeChange}
              min="0"
              onWheel={disableScroll}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-200"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="maxPrice"
            className="block text-xs font-medium text-gray-600"
          >
            Maximum Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
            <input
              id="maxPrice"
              name="maximum"
              type="number"
              value={formData.priceRange.maximum}
              onChange={handlePriceRangeChange}
              min="0"
              onWheel={disableScroll}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-all duration-200"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Set your service price range to help clients understand your rates
        </p>
      </div>
    </div>
  );
};

export default ServicePriceField;
