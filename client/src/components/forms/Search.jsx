import React from "react";
import "./form.css";
import { SearchOutlined } from "@ant-design/icons";

const Search = () => {
  return (
    <div className="search flex items-center justify-center mt-2">
      <div className="w-full sm:w-auto  px-4">
        <div className="border border-gray-300 p-2 rounded input-div flex justify-center items-center w-full">
          <input
            placeholder="Who do you need?...."
            className="search-input h-full outline-none w-full"
          />

          <div>
            <button className="search-button ">
              <SearchOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
