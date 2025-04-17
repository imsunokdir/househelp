import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import NavigationContext from "../contexts/NavigationContext";
import { clearTempUploadedImages } from "../utils/clearTempUploadedImages";

const DynamicBreadCrumbs = () => {
  const location = useLocation();

  const { isFormDirty } = useContext(NavigationContext);

  const shouldApplyBlocker =
    location.pathname.includes("edit-single-service") ||
    location.pathname.includes("add-service-form") ||
    location.pathname.includes("edit-service");

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const extraBreadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const isServiceId = /^[0-9a-fA-F]{24}$/.test(snippet);
    const isLastItem = index === pathSnippets.length - 1;
    const isEditService = pathSnippets.includes("edit-service");

    const name =
      isServiceId && (isLastItem || isEditService)
        ? "Details"
        : snippet.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      key: url,
      title: name,
      path: url,
    };
  });

  const breadcrumbItems = [
    {
      key: "/",
      title: "Home",
      path: "/",
    },
    ...extraBreadcrumbItems,
  ];

  const handleBreadcrumbClick = (e, path) => {
    if (isFormDirty && shouldApplyBlocker) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        e.preventDefault();
      } else {
        clearTempUploadedImages();
      }
    }
  };

  return (
    <div className="bg-white p-4">
      <Breadcrumb
        items={breadcrumbItems.map((item) => ({
          key: item.key,
          title: (
            <Link
              to={item.path}
              onClick={(e) => handleBreadcrumbClick(e, item.path)}
            >
              {item.title}
            </Link>
          ),
        }))}
      />
    </div>
  );
};

export default DynamicBreadCrumbs;
