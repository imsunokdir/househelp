import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/accounts": "Accounts",
  "/accounts/personal-info": "Personal Info",
  "/accounts/my-service-menu": "My Service Menu",
  "/accounts/my-service-menu/my-services": "My Services",
  "/accounts/my-service-menu/my-services/details": "My Service",
  "/accounts/my-service-menu/my-services/edit-single-service": "Edit Service",
  "/accounts/my-service-menu/add-service-form": "Add Service",
  "/accounts/profile-check": "Profile Check",
  "/accounts/account-settings-menu": "Account Settings",
  "/accounts/account-settings-menu/log-out-all": "Active Sessions",
  "/accounts/account-settings-menu/delete-acc": "Delete Account",
  "/accounts/change-password": "Change Password",
  "/accounts/log-out-all": "Log Out All",
  "/accounts/delete-acc": "Delete Account",
  "/accounts/my-service-menu/saved-services": "Saved Services",
};

const DynamicBreadCrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname
    .split("/")
    .filter((i) => i)
    .slice(1);

  let breadcrumbItems = [{ path: "/accounts", title: "Accounts" }];

  pathSnippets.forEach((segment, index) => {
    let url = `/accounts/${pathSnippets.slice(0, index + 1).join("/")}`;

    // Handle dynamic service ID
    if (
      url.startsWith("/accounts/my-service-menu/my-services/details/") ||
      url.startsWith(
        "/accounts/my-service-menu/my-services/edit-single-service/"
      )
    ) {
      return; // Skip adding the ID as a breadcrumb
    }

    breadcrumbItems.push({
      path: url,
      title: breadcrumbNameMap[url] || segment,
    });
  });

  return (
    <Breadcrumb className="p-3">
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={item.path}>
          {index !== breadcrumbItems.length - 1 ? (
            <Link to={item.path}>{item.title}</Link>
          ) : (
            item.title
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default DynamicBreadCrumbs;
