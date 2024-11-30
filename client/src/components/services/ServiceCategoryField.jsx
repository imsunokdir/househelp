import { Select } from "antd";
import React from "react";

const ServiceCategoryField = (params) => {
  const { loading, categories, handleCategory, formData } = params;
  return (
    <div className="space-y-2">
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700"
      >
        Category
      </label>

      <Select
        showSearch
        style={{
          width: 300,
        }}
        placeholder="Select a category"
        optionFilterProp="label"
        loading={loading} // Show loading spinner while fetching
        options={categories} // Dynamically loaded categories
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        onChange={handleCategory}
        value={formData && formData.category}
      />
    </div>
  );
};

export default ServiceCategoryField;
