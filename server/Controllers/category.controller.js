const Category = require("../Models/category.schema");

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }
    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category name must be between 3 and 50 characters",
      });
    }
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }
    const newCategory = new Category({
      name: name.trim(),
    });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCategories = async (req, res) => {
  console.log("get catt catt catt **************************************");
  try {
    const categories = await Category.find({});
    // console.log("Category:", categories)
    if (categories.length === 0) {
      return res.status(200).json({
        message: "No categories found",
        success: true,
        data: [],
      });
    }
    return res.status(200).json({
      message: "Categories found",
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error,
      success: false,
    });
  }
};

module.exports = { createCategory, getAllCategories };
