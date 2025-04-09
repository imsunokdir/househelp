const ACCOUNTS = "/accounts";
const SERVICE_MENU = `${ACCOUNTS}/my-service-menu`;
const ACCOUNT_SETTINGS_MENU = `${ACCOUNTS}/account-settings-menu`;

const ROUTES = {
  ACCOUNTS,

  // Account Tabs
  ACCOUNT_TABS: ACCOUNTS,
  PROFILE_CHECK: `${ACCOUNTS}/profile-check`,
  PERSONAL_INFO: `${ACCOUNTS}/personal-info`,

  // Service Menu
  SERVICE_MENU,
  ADD_SERVICE_FORM: `${SERVICE_MENU}/add-service-form`,
  MY_SERVICES: `${SERVICE_MENU}/my-services`,
  SAVED_SERVICES: `${SERVICE_MENU}/saved-services`,
  SERVICE_DETAILS: `${SERVICE_MENU}/my-services/details/:serviceId`,
  SERVICE_EDIT: `${SERVICE_MENU}/my-services/edit-single-service/:serviceId`,
  SERVICE_EDIT_NESTED: `${SERVICE_MENU}/my-services/details/:serviceId/edit-single-service/:serviceId`,

  // Account Settings
  ACCOUNT_SETTINGS_MENU,
  CHANGE_PASSWORD: `${ACCOUNT_SETTINGS_MENU}/change-password`,
  LOG_OUT_ALL: `${ACCOUNT_SETTINGS_MENU}/log-out-all`,
  DELETE_ACCOUNT: `${ACCOUNT_SETTINGS_MENU}/delete-acc`,
};

export default ROUTES;
