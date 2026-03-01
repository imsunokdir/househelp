const mongoose = require("mongoose");
const Service = require("../Models/service.schema");
const Category = require("../Models/category.schema");
const User = require("../Models/user.schema");
const { validateServiceData } = require("../Utils/validateServiceData");
const { cloudinary } = require("../Configurations/cloudinary.config");

// ─── Cloudinary Helpers ───────────────────────────────────────────────────────

const uploadImagesToCloudinary = async (files) => {
  const uploadedImageUrls = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "services" },
          (error, result) => {
            if (error) reject(new Error("Upload to Cloudinary failed"));
            else resolve(result.secure_url);
          },
        );
        uploadStream.end(file.buffer);
      });
      uploadedImageUrls.push(uploadResult);
    }
  }

  return uploadedImageUrls;
};

// ─── Create Service ───────────────────────────────────────────────────────────

const createService = async (req, res) => {
  try {
    const {
      serviceName,
      description,
      experience,
      skills,
      priceRange,
      availability,
      category,
      location,
      status,
      images,
    } = req.body;

    if (!req.session?.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to post a service.",
      });
    }

    const userId = req.session.user.userId;

    // Free tier limit — only 1 free active service allowed
    const freeServiceCount = await Service.countDocuments({
      createdBy: userId,
      isPaid: false,
      isExpired: false,
    });

    if (freeServiceCount >= 1) {
      return res.status(403).json({
        success: false,
        message: "Free tier limit reached. You can only post 1 free service.",
        upgradeRequired: true,
      });
    }

    const requiredFields = [
      "serviceName",
      "description",
      "experience",
      "skills",
      "priceRange",
      "availability",
      "category",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const validationResult = validateServiceData({
      serviceName,
      description,
      experience,
      skills,
      priceRange,
      availability,
      category,
      status,
    });

    if (!validationResult.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        errors: validationResult.errors,
      });
    }

    // 30 day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const serviceObj = new Service({
      serviceName: serviceName.trim(),
      description: description.trim(),
      experience: Number(experience),
      skills: Array.isArray(skills)
        ? skills.map((skill) => skill.trim())
        : [skills.trim()],
      priceRange: {
        minimum: Number(priceRange.minimum),
        maximum: Number(priceRange.maximum),
      },
      availability: Array.isArray(availability) ? availability : [availability],
      category: category.trim(),
      createdBy: userId,
      location,
      status,
      images: Array.isArray(images)
        ? images
            .filter((img) => img?.url && img?.public_id)
            .map((img) => ({
              url: String(img.url),
              public_id: String(img.public_id),
            }))
        : [],
      expiresAt,
      isExpired: false,
      isPaid: false,
      createdAt: new Date(),
    });

    const newService = await serviceObj.save();

    // Update Category max values
    const categoryDoc = await Category.findById(category.trim());
    if (categoryDoc) {
      let isUpdated = false;
      if (priceRange.maximum > categoryDoc.maxPrice) {
        categoryDoc.maxPrice = priceRange.maximum;
        isUpdated = true;
      }
      if (experience > categoryDoc.maxExp) {
        categoryDoc.maxExp = experience;
        isUpdated = true;
      }
      if (isUpdated) await categoryDoc.save();
    }

    return res.status(201).json({
      success: true,
      message:
        "Service posted successfully. Your listing is active for 30 days.",
      data: {
        serviceId: newService._id,
        serviceName: newService.serviceName,
        category: newService.category,
        expiresAt: newService.expiresAt,
        isPaid: newService.isPaid,
        createdAt: newService.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to post service. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ─── Get All Services ─────────────────────────────────────────────────────────

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate("category")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Get Services By Category ─────────────────────────────────────────────────

const getServiceByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const totalServices = await Service.countDocuments({
      category: categoryId,
    });

    const services = await Service.find({ category: categoryId })
      .populate("category", "name")
      .populate("createdBy", "username")
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = page * limit < totalServices;

    return res.status(200).json({
      success: true,
      data: services,
      hasMore,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ─── Get Service By ID ────────────────────────────────────────────────────────

const getServiceById = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId).populate("createdBy");
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ─── Get My Services ──────────────────────────────────────────────────────────

const getMyServices = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const services = await Service.find({ createdBy: userId });

    return res.status(200).json({
      success: true,
      data: services,
      message:
        services.length === 0
          ? "No services found"
          : "Services fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// ─── Update Service ───────────────────────────────────────────────────────────

const updateService = async (req, res) => {
  const { serviceId, imagesToBeDeleted, formData } = req.body;

  try {
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const currentService = await Service.findById(serviceId);
    if (!currentService) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Delete removed images from Cloudinary
    if (imagesToBeDeleted?.length > 0) {
      const currentImageMap = new Map(
        currentService.images.map((img) => [img._id.toString(), img.url]),
      );

      const toDelete = imagesToBeDeleted.filter((img) =>
        currentImageMap.has(img._id),
      );

      await Promise.all(
        toDelete.map((img) => {
          const publicId = img.url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(`services/${publicId}`);
        }),
      );
    }

    // Build final image list
    const finalImages = (formData.images || []).filter(
      (img) => !imagesToBeDeleted?.find((delImg) => delImg._id === img._id),
    );

    const updatedData = {
      ...(formData.serviceName && { serviceName: formData.serviceName.trim() }),
      ...(formData.status && { status: formData.status.trim() }),
      ...(formData.description && { description: formData.description.trim() }),
      ...(formData.experience && { experience: Number(formData.experience) }),
      ...(formData.skills?.length > 0 && {
        skills: formData.skills.map((skill) => skill.trim()),
      }),
      ...(formData.priceRange?.minimum &&
        formData.priceRange?.maximum && {
          priceRange: {
            minimum: Number(formData.priceRange.minimum),
            maximum: Number(formData.priceRange.maximum),
          },
        }),
      ...(formData.availability?.length > 0 && {
        availability: formData.availability,
      }),
      ...(formData.category && { category: formData.category.trim() }),
      ...(formData.location && { location: formData.location }),
      images: finalImages,
    };

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { $set: updatedData },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// ─── Delete Service ───────────────────────────────────────────────────────────

const deleteService = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const deletedService = await Service.deleteOne({ _id: serviceId });

    if (deletedService.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete service. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ─── Get Nearby Services ──────────────────────────────────────────────────────

const getNearbyServices = async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 10, longitude, latitude, filterData } = req.body;

  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);

  const { priceRange = {}, rating, experience } = filterData;

  const minPrice = priceRange.minimum;
  const maxPrice = priceRange.maximum || Infinity;
  const exp = experience || 0;
  const servicerating = rating || 0;

  if (isNaN(lon) || isNaN(lat)) {
    return res.status(400).json({ message: "Invalid location coordinates." });
  }

  const query = {
    category: new mongoose.Types.ObjectId(categoryId),
    status: "Active",
    isExpired: false,
    ...(minPrice && { "priceRange.minimum": { $gte: minPrice } }),
    ...(maxPrice &&
      maxPrice !== Infinity && {
        "priceRange.maximum": { $lte: maxPrice },
      }),
    ...(servicerating && { averageRating: { $gte: servicerating } }),
    ...(exp && { experience: { $gte: exp } }),
  };

  try {
    const totalServices = await Service.countDocuments(query);

    const services = await Service.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "distance",
          spherical: true,
          query,
        },
      },
      {
        $addFields: {
          distanceInKm: { $divide: ["$distance", 1000] },
          boostPriority: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$isBoosted", true] },
                  { $gt: ["$boostExpiresAt", new Date()] },
                ],
              },
              then: 0,
              else: 1,
            },
          },
        },
      },
      { $sort: { boostPriority: 1, distance: 1, _id: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          serviceName: 1,
          description: 1,
          experience: 1,
          skills: 1,
          priceRange: 1,
          availability: 1,
          category: 1,
          status: 1,
          averageRating: 1,
          ratingCount: 1,
          location: 1,
          images: 1,
          isBoosted: 1,
          boostExpiresAt: 1,
          distanceInKm: 1,
          distance: 1,
          boostPriority: 1,
          createdAt: 1,
          "createdBy._id": 1,
          "createdBy.username": 1,
          "createdBy.avatar": 1,
          "createdBy.mobile": 1,
        },
      },
    ]);

    const hasMore = page * limit < totalServices;

    return res.status(200).json({
      message: "Nearby services fetched successfully.",
      services,
      totalCount: totalServices,
      hasMore,
      page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ─── Update Service Views ─────────────────────────────────────────────────────

const updateServiceViews = async (req, res) => {
  const { serviceId } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { $inc: { views: 1 } },
      { new: true },
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "View updated",
      service: updatedService,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating views" });
  }
};

// ─── Saved Services ───────────────────────────────────────────────────────────

const toggleSaveService = async (req, res) => {
  const { serviceId } = req.body;
  const { userId } = req.session.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
    const serviceExists = user.savedServices.some((id) =>
      id.equals(serviceObjectId),
    );

    const updatedServices = serviceExists
      ? user.savedServices.filter((id) => !id.equals(serviceObjectId))
      : [...user.savedServices, serviceObjectId];

    user.savedServices = updatedServices;
    await user.save();

    return res.status(200).json({
      message: `Service ${serviceExists ? "removed" : "saved"} successfully`,
      isSaved: !serviceExists,
      services: user.savedServices,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const checkSavedService = async (req, res) => {
  const { serviceId } = req.query;
  const { userId } = req.session.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId);
    const serviceExists = user.savedServices.some((id) =>
      id.equals(serviceObjectId),
    );

    return res.status(200).json({
      message: "Service check successful",
      isSaved: serviceExists,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

const getSavedServices = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const user = await User.findById(userId).populate("savedServices").exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Saved services fetched successfully",
      savedServices: user.savedServices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteSingleSavedService = async (req, res) => {
  const { serviceId } = req.body;
  const { userId } = req.session.user;

  try {
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedServices: serviceId } },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Service removed successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ─── Service Images ───────────────────────────────────────────────────────────

const uploadServiceImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "services",
    });

    return res.status(200).json({
      message: "Image uploaded successfully",
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    return res.status(500).json({ error: "Image upload failed." });
  }
};

const deleteServiceImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ error: "Public ID is required." });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      return res.status(200).json({
        message: "Image deleted successfully",
        public_id,
      });
    } else {
      return res.status(400).json({ error: "Failed to delete image." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Image deletion failed." });
  }
};

// ─── Filtered Service Count ───────────────────────────────────────────────────

const getFilteredServiceCount = async (req, res) => {
  const { categoryId } = req.params;
  const { longitude, latitude, filterData } = req.body;

  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);

  const { priceRange = {}, rating, experience } = filterData;

  const minPrice = priceRange.minimum;
  const maxPrice = priceRange.maximum || Infinity;
  const exp = experience || 0;
  const servicerating = rating || 0;

  if (isNaN(lon) || isNaN(lat)) {
    return res.status(400).json({ message: "Invalid location coordinates." });
  }

  const query = {
    category: new mongoose.Types.ObjectId(categoryId),
    status: "Active",
    isExpired: false,
    ...(minPrice && { "priceRange.minimum": { $gte: minPrice } }),
    ...(maxPrice &&
      maxPrice !== Infinity && {
        "priceRange.maximum": { $lte: maxPrice },
      }),
    ...(servicerating && { averageRating: { $gte: servicerating } }),
    ...(exp && { experience: { $gte: exp } }),
  };

  try {
    const count = await Service.countDocuments(query);
    return res.status(200).json({
      message: "Filtered service count fetched successfully.",
      count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ─── Search Services ──────────────────────────────────────────────────────────
// Searches by keyword across serviceName, description, skills
// Combined with location for nearby results

// ─── Search Services ──────────────────────────────────────────────────────────
// REPLACE your existing searchServices function with this

// ─── Search Services ──────────────────────────────────────────────────────────
// REPLACE your existing searchServices function with this

const searchServices = async (req, res) => {
  const { keyword, longitude, latitude, page = 1, limit = 10 } = req.body;

  if (!keyword || keyword.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Search keyword must be at least 2 characters.",
    });
  }

  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);
  const hasLocation = !isNaN(lon) && !isNaN(lat);

  try {
    let services;
    let totalServices;

    if (hasLocation) {
      // ── With location — use regex (geoNear + $text don't work together) ────
      const regexQuery = {
        status: "Active",
        isExpired: false,
        $or: [
          { serviceName: { $regex: keyword.trim(), $options: "i" } },
          { description: { $regex: keyword.trim(), $options: "i" } },
          { skills: { $regex: keyword.trim(), $options: "i" } },
        ],
      };

      totalServices = await Service.countDocuments(regexQuery);

      if (totalServices === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          totalCount: 0,
          hasMore: false,
          keyword,
        });
      }

      services = await Service.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lon, lat] },
            distanceField: "distance",
            spherical: true,
            query: regexQuery,
          },
        },
        {
          $addFields: {
            distanceInKm: { $divide: ["$distance", 1000] },
            boostPriority: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$isBoosted", true] },
                    { $gt: ["$boostExpiresAt", new Date()] },
                  ],
                },
                then: 0,
                else: 1,
              },
            },
          },
        },
        { $sort: { boostPriority: 1, distance: 1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        { $unwind: "$createdBy" },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            serviceName: 1,
            description: 1,
            experience: 1,
            skills: 1,
            priceRange: 1,
            availability: 1,
            category: 1,
            status: 1,
            averageRating: 1,
            ratingCount: 1,
            images: 1,
            isBoosted: 1,
            boostExpiresAt: 1,
            distanceInKm: 1,
            distance: 1,
            boostPriority: 1,
            createdAt: 1,
            "createdBy._id": 1,
            "createdBy.username": 1,
            "createdBy.avatar": 1,
            "createdBy.mobile": 1,
          },
        },
      ]);
    } else {
      // ── No location — use $text search with relevance score ────────────────
      const textQuery = {
        $text: { $search: keyword.trim() },
        status: "Active",
        isExpired: false,
      };

      totalServices = await Service.countDocuments(textQuery);

      if (totalServices === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          totalCount: 0,
          hasMore: false,
          keyword,
        });
      }

      services = await Service.aggregate([
        { $match: textQuery },
        {
          $addFields: {
            searchScore: { $meta: "textScore" },
            boostPriority: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$isBoosted", true] },
                    { $gt: ["$boostExpiresAt", new Date()] },
                  ],
                },
                then: 0,
                else: 1,
              },
            },
          },
        },
        { $sort: { boostPriority: 1, searchScore: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        { $unwind: "$createdBy" },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            serviceName: 1,
            description: 1,
            experience: 1,
            skills: 1,
            priceRange: 1,
            availability: 1,
            category: 1,
            status: 1,
            averageRating: 1,
            ratingCount: 1,
            images: 1,
            isBoosted: 1,
            boostExpiresAt: 1,
            searchScore: 1,
            createdAt: 1,
            "createdBy._id": 1,
            "createdBy.username": 1,
            "createdBy.avatar": 1,
            "createdBy.mobile": 1,
          },
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      data: services,
      totalCount: totalServices,
      hasMore: page * limit < totalServices,
      page,
      keyword,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
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
};
