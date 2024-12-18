import React from "react";
import "./form.css";
import { SearchOutlined } from "@ant-design/icons";
import { SearchIcon } from "lucide-react";
import { SearchOffTwoTone } from "@mui/icons-material";

const Search = () => {
  return (
    <div className="search flex items-center justify-center mt-2">
      <div className="w-full px-2 sm:px-4 flex justify-center itrems-center">
        <div className=" border border-gray-300 p-2 rounded input-div flex flex-wrap gap-2 justify-center items-center w-full sm:max-w-md overflow-hidden">
          <input
            placeholder="Who do you need?...."
            className="search-input flex-1 min-w-0 h-full outline-none p-1"
          />
          <button className="search-button p-2 bg-gray-200 rounded">
            <SearchOutlined style={{ color: "#5e17eb", fontSize: "30px" }} />
            {/* <SearchIcon style={{ color: "#5e17eb", fontSize: "15px" }} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;
