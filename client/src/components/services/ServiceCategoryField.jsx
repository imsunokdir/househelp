import { Select } from "antd";
import { ListFilter } from "lucide-react";
import React from "react";

const ServiceCategoryField = ({
  loading,
  categories,
  handleCategory,
  formData,
}) => {
  return (
    <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center border-b border-gray-100 pb-2">
        <ListFilter className="h-4 w-4 mr-2 text-purple-500" />
        <label htmlFor="category" className="text-sm font-medium text-gray-800">
          Category
        </label>
      </div>

      <div className="pt-1">
        <Select
          showSearch
          style={{
            width: "100%",
          }}
          placeholder="Select a category"
          optionFilterProp="label"
          loading={loading}
          options={categories}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          onChange={handleCategory}
          value={formData && formData.category}
          className="rounded-md"
          popupClassName="rounded-md border border-gray-200 shadow-md"
          size="large"
        />
      </div>
      <p className="text-xs text-gray-500">
        Choose the category that best represents your service
      </p>
    </div>
  );
};

export default ServiceCategoryField;
