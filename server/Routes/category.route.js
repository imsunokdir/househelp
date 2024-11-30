const express = require("express");
const {
  createCategory,
  getAllCategories,
} = require("../Controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.post("/create-category", createCategory);
categoryRouter.get("/get-categories", getAllCategories);

module.exports = { categoryRouter };
