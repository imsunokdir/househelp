const express = require("express");
const {
  registerService,
  getAllServices,
  getServiceByCategory,
  getServiceById,
  getMyServices,
  updateService,
  getNearbyServices,
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
serviceRouter.get("/get-nearby-services/:categoryId", getNearbyServices);

module.exports = { serviceRouter };
