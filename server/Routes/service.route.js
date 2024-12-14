const express = require("express");
const {
  registerService,
  getAllServices,
  getServiceByCategory,
  getServiceById,
  getMyServices,
  updateService,
  getNearbyServices,
  getNearbyServicesTest,
  getFilteredServices,
  deleteService,
  getNearbyServicesTest2,
} = require("../Controllers/service.controller");
const { isAuth } = require("../Middlewares/isAuth");
const serviceRouter = express.Router();

const multer = require("multer");
// const upload = multer({ storage: multer.memoryStorage() });

const storage = multer.memoryStorage();
const upload = multer({ storage });

serviceRouter.post(
  "/register-service",
  upload.array("serviceImages", 8),
  registerService
);
serviceRouter.get("/get-all-services", getAllServices);
serviceRouter.get("/get-service/:serviceId", getServiceById);
serviceRouter.get("/service-category/:categoryId", getServiceByCategory);
serviceRouter.get("/my-services", isAuth, getMyServices);
serviceRouter.post(
  "/update-service",
  upload.array("updatedImages", 8),
  updateService
);
serviceRouter.post("/get-nearby-services/:categoryId", getNearbyServicesTest2);
serviceRouter.get("/filter-services/:categoryId", getFilteredServices);
serviceRouter.delete("/delete-service/:serviceId", deleteService);

module.exports = { serviceRouter };
