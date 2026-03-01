const express = require("express");
const {
  createService,
  getAllServices,
  getServiceByCategory,
  getServiceById,
  getMyServices,
  updateService,
  getNearbyServices,
  deleteService,
  updateServiceViews,
  toggleSaveService,
  checkSavedService,
  getSavedServices,
  deleteSingleSavedService,
  uploadServiceImage,
  deleteServiceImage,
  getFilteredServiceCount,
  searchServices,
} = require("../Controllers/service.controller");
const { isAuth } = require("../Middlewares/isAuth");

const serviceRouter = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ─── Service CRUD ─────────────────────────────────────────────────────────────
serviceRouter.post("/create-service", isAuth, createService);
serviceRouter.get("/get-all-services", getAllServices);
serviceRouter.get("/get-service/:serviceId", getServiceById);
serviceRouter.get("/service-category/:categoryId", getServiceByCategory);
serviceRouter.get("/my-services", isAuth, getMyServices);
serviceRouter.post("/update-service", isAuth, updateService);
serviceRouter.delete("/delete-service/:serviceId", isAuth, deleteService);

// ─── Nearby & Filtered ───────────────────────────────────────────────────────
serviceRouter.post("/get-nearby-services/:categoryId", getNearbyServices);
serviceRouter.post("/get-filtered-count/:categoryId", getFilteredServiceCount);

// ─── Views ────────────────────────────────────────────────────────────────────
serviceRouter.put("/views/inc", updateServiceViews);

// ─── Saved Services ───────────────────────────────────────────────────────────
serviceRouter.put("/save-service", isAuth, toggleSaveService);
serviceRouter.get("/check-saved-service", isAuth, checkSavedService);
serviceRouter.get("/get-saved-services", isAuth, getSavedServices);
serviceRouter.delete(
  "/delete-single-saved-service",
  isAuth,
  deleteSingleSavedService,
);

// ─── Service Images ───────────────────────────────────────────────────────────
serviceRouter.post(
  "/upload-service-image",
  isAuth,
  upload.single("image"),
  uploadServiceImage,
);
serviceRouter.delete("/delete-service-image", isAuth, deleteServiceImage);

serviceRouter.post("/search", searchServices);

module.exports = { serviceRouter };
