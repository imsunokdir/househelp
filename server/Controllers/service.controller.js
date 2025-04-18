const mongoose = require("mongoose");
const Rating = require("../Models/rating.schema");
const Service = require("../Models/service.schema");
const Category = require("../Models/category.schema");
const { find } = require("../Models/user.schema");
const { validateServiceData } = require("../Utils/validateServiceData");
const User = require("../Models/user.schema");

// let objectId;
// objectId = mongoose.Types.ObjectId(categoryId);

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLDNRY_CLOUD_NAME,
  api_key: process.env.CLDNRY_API_KEY,
  api_secret: process.env.CLDNRY_API_SECRET,
});

const uploadImagesToCloudinary = async (files) => {
  const uploadedImageUrls = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "services" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("Upload to Cloudinary failed"));
            } else {
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(file.buffer); // Ensure to end the stream with the file buffer
      });
      uploadedImageUrls.push(uploadResult);
    }
  }

  return uploadedImageUrls;
};

const registerService = async (req, res) => {
  try {
    // Destructure and sanitize input
    // console.log("req.files", req.files);
    // console.log("req.body:", req.body);

    const { serviceName, description, experience, category, status } = req.body;
    // console.log("status:", status);

    const skills = JSON.parse(req.body.skills);
    const priceRange = JSON.parse(req.body.priceRange);
    const availability = JSON.parse(req.body.availability);
    const location = JSON.parse(req.body.location);

    // Check if user is authenticated
    if (!req.session?.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to register a service.",
      });
    }

    // Validate all required fields exist
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

    // Validate input data (assuming validateServiceData function exists)
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

    const uploadedImageUrls = await uploadImagesToCloudinary(req.files);

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
      createdBy: req.session.user.userId,
      location,
      status,
      images: uploadedImageUrls.map((url) => ({ url })),
      createdAt: new Date(),
    });

    //   // Save to database
    const newService = await serviceObj.save();

    //update maxPrice in the Category schema if necessary
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
      if (isUpdated) {
        await categoryDoc.save();
      }
    }

    //   // Return success response
    return res.status(201).json({
      success: true,
      message: "Service registered successfully",
      data: {
        serviceId: newService._id,
        serviceName: newService.serviceName,
        category: newService.category,
        createdAt: newService.createdAt,
      },
    });
  } catch (error) {
    console.error("Service registration error:", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A service with this name already exists",
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Failed to register service. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate("category")
      .populate("createdBy");
    if (!services) {
      return res.status(404).json({
        success: false,
        message: "No services found",
      });
    }
    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
};

const getServiceByCategory = async (req, res) => {
  const { categoryId } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  // console.log("page:", page);
  // console.log("limit:", limit);
  try {
    // Count total number of services in the category
    const totalServices = await Service.countDocuments({
      category: categoryId,
    });

    // console.log("total cconut:", totalServices);
    // Fetch services with pagination
    const services = await Service.find({ category: categoryId })
      .populate("category", "name")
      .populate("createdBy", "username")
      .skip((page - 1) * limit)
      .limit(limit);
    // console.log("services::", services);

    // Determine if there are more services to load
    const hasMore = page * limit < totalServices;

    if (services.length > 0) {
      return res.status(200).json({
        success: true,
        data: services,
        hasMore, // Include hasMore field in the response
        page,
      });
    } else if (services.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No categories were found",
        hasMore, // Include hasMore field in the response even if no services are found
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

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
      message: "internal server error",
    });
  }
};

const getMyServices = async (req, res) => {
  const { userId } = req.session.user;

  try {
    const services = await Service.find({ createdBy: userId });

    if (services.length === 0) {
      return res.status(200).json({
        data: [],
        message: "No services found",
        success: true,
      });
    }
    return res.status(200).json({
      data: services,
      message: "Fetched services successfully.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

const updateService = async (req, res) => {
  console.time("Total Time");
  const { serviceName, description, experience, category, serviceId, status } =
    req.body;

  try {
    // Parse complex fields with error handling and default values
    const skills = JSON.parse(req.body.skills || "[]");
    const priceRange = JSON.parse(req.body.priceRange || "{}");
    const availability = JSON.parse(req.body.availability || "[]");
    const location = JSON.parse(req.body.location || "{}");
    const imagesToBeDeleted = JSON.parse(req.body.imagesToBeDeleted || "[]");

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const updatedData = {
      ...(serviceName && { serviceName: serviceName.trim() }),
      ...(status && { status: status.trim() }),
      ...(description && { description: description.trim() }),
      ...(experience && { experience: Number(experience) }),
      ...(skills.length > 0 && { skills: skills.map((skill) => skill.trim()) }),
      ...(priceRange?.minimum &&
        priceRange?.maximum && {
          priceRange: {
            minimum: Number(priceRange.minimum),
            maximum: Number(priceRange.maximum),
          },
        }),
      ...(availability.length > 0 && { availability }),
      ...(category && { category: category.trim() }),
      ...(location && { location }),
    };

    // Parallel operations for better performance
    const updateOperations = [
      // Update service details
      Service.findByIdAndUpdate(
        serviceId,
        { $set: updatedData },
        { new: true, runValidators: true }
      ),
    ];

    // Parallel image deletion from Cloudinary
    if (imagesToBeDeleted.length > 0) {
      const cloudinaryDeletions = imagesToBeDeleted.map(async (image) => {
        const publicId = image.url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(`services/${publicId}`);
      });

      updateOperations.push(
        Promise.all(cloudinaryDeletions),
        Service.findByIdAndUpdate(serviceId, {
          $pull: {
            images: { _id: { $in: imagesToBeDeleted.map((img) => img._id) } },
          },
        })
      );
    }

    // Parallel new image uploads
    if (req.files && req.files.length > 0) {
      const uploadAndUpdateOperation = async () => {
        const uploadedImageUrls = await uploadImagesToCloudinary(req.files);
        const newImages = uploadedImageUrls.map((url) => ({ url }));
        return Service.findByIdAndUpdate(serviceId, {
          $push: { images: { $each: newImages } },
        });
      };

      updateOperations.push(uploadAndUpdateOperation());
    }

    // Execute all operations in parallel
    const [updatedService, ...otherResults] = await Promise.all(
      updateOperations
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }
    console.timeEnd("Total Time");
    res.status(200).json({
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getNearbyServices = async (req, res) => {
  const { categoryId } = req.params;
  const { longitude, latitude } = req.query;

  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);
  // console.log("catId1:", categoryId);
  // console.log("lon:", lon);
  // console.log("lat:", lat);

  if (isNaN(lon) || isNaN(lat)) {
    return res.status(400).json({
      message: "Invalid location coordinates.",
    });
  }

  try {
    const services = await Service.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "distance",
          spherical: true,
          query: { category: new mongoose.Types.ObjectId(categoryId) },
        },
      },
      {
        $sort: { distance: 1 },
      },
      {
        $project: {
          _id: 1,
          serviceName: 1,
          // description: 1,
          // experience: 1,
          // skills: 1,
          // priceRange: 1,
          // availability: 1,
          // category: 1,
          // createdBy: 1,
          // status: 1,
          // averageRating: 1,
          // ratingCount: 1,
          // location: 1,
          // createdAt: 1,
          // updatedAt: 1,
          distance: 1,
        },
      },
    ]);
    // const services = await Service.findById({ category:categoryId });
    return res.status(200).json({
      message: "Nearby services fetched successfully.",
      services,
    });
  } catch (error) {
    console.log("error in fetching nearby services:", error);
  }
};

const getNearbyServicesTest = async (req, res) => {
  // console.log("nearby");
  const { categoryId } = req.params;
  const { page = 1, limit = 5, longitude, latitude, filterData } = req.query; // Add page and limit
  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);

  const { priceRange, rating, experience } = filterData;

  // console.log("catId:", categoryId);
  // console.log("lon:", lon);
  // console.log("lat:", lat);
  // console.log("page:", page);
  // console.log("limit:", limit);
  // console.log("filter data:", filterData);

  if (isNaN(lon) || isNaN(lat)) {
    return res.status(400).json({
      message: "Invalid location coordinates.",
    });
  }

  try {
    // Count total number of services
    const totalServices = await Service.countDocuments({
      category: new mongoose.Types.ObjectId(categoryId),
    });

    // Fetch services with pagination
    const services = await Service.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "distance",
          spherical: true,
          query: { category: new mongoose.Types.ObjectId(categoryId) },
        },
      },
      {
        $addFields: {
          distanceInKm: { $divide: ["$distance", 1000] },
        },
      },
      {
        $sort: {
          distance: 1,
          _id: 1, //secondary sort to ensure consistent ordering
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: "$createdBy",
      },
      {
        $lookup: {
          from: "categories", // Assuming the categories collection is named 'categories'
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ]);

    // Determine if there are more services to load
    const hasMore = page * limit < totalServices;

    //

    return res.status(200).json({
      message: "Nearby services fetched successfully.",
      services,
      totalCount: totalServices, // Include total count in the response
      hasMore, // Include hasMore flag
    });
  } catch (error) {
    // console.log("Error in fetching nearby services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Send the error message
    });
  }
};

const getNearbyServicesTest2 = async (req, res) => {
  // console.log("nearby");
  const { categoryId } = req.params;
  const { page = 1, limit = 5, longitude, latitude, filterData } = req.body; // Add page and limit
  console.log("Page:", page);
  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);

  const { priceRange = {}, rating, experience } = filterData;

  const minPrice = priceRange.minimum;
  const maxPrice = priceRange.maximum || Infinity;
  const exp = experience || 0;
  const servicerating = rating || 0;

  // console.log("catId:", categoryId);
  // console.log("lon:", lon);
  // console.log("lat:", lat);
  // console.log("page:", page);
  // console.log("limit:", limit);
  // console.log("filter data:", filterData);
  // console.log("price range :", priceRange);
  // console.log("minPrice:", minPrice);
  // console.log("maxPrice:", maxPrice);
  // console.log("exp:", exp);
  // console.log("servicerating:", servicerating);
  // console.log("rating :", rating);
  // console.log("experience :", experience);

  if (isNaN(lon) || isNaN(lat)) {
    return res.status(400).json({
      message: "Invalid location coordinates.",
    });
  }

  const query = {
    category: new mongoose.Types.ObjectId(categoryId),
    status: "Active",
    ...(minPrice && { "priceRange.minimum": { $gte: minPrice } }),
    ...(maxPrice && { "priceRange.maximum": { $lte: maxPrice } }),
    ...(servicerating && { averageRating: { $gte: servicerating } }),
    ...(exp && { experience: { $gte: exp } }),
  };

  try {
    //test
    // const countResult = await Service.find(query);
    // console.log("counrt query resukt:", countResult);

    // Count total number of services
    const totalServices = await Service.countDocuments(query);

    // Fetch services with pagination
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
        },
      },
      {
        $sort: {
          distance: 1,
          _id: 1, //secondary sort to ensure consistent ordering
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: "$createdBy",
      },
      {
        $lookup: {
          from: "categories", // Assuming the categories collection is named 'categories'
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
    ]);

    // console.log("nby services:", services);

    // Determine if there are more services to load
    const hasMore = page * limit < totalServices;

    //

    return res.status(200).json({
      message: "Nearby services fetched successfully.",
      services,
      totalCount: totalServices, // Include total count in the response
      hasMore, // Include hasMore flag
      page,
    });
  } catch (error) {
    // console.log("Error in fetching nearby services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message, // Send the error message
    });
  }
};

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
    console.error("Error deleting service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Increment the views for a service
const updateServiceViews = async (req, res) => {
  const { serviceId } = req.body;
  // console.log("serciveId views:", serviceId);

  try {
    // Increment the views field by 1
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { $inc: { views: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "View updated", service: updatedService });
  } catch (error) {
    res.status(500).json({ error: "Error updating views" });
  }
};

const getFilteredServices = async (req, res) => {
  const { categoryId } = req.params;
  const { longitude, latitude, filterOptions } = req.query;
};

const toggleSaveService = async (req, res) => {
  const { serviceId } = req.body;
  if (!req.session.user) {
    return res.status(404).json({
      message: "User not found, please check and login/register if required.",
    });
  }
  const { userId } = req.session.user;

  // console.log("service id toggle:", serviceId);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId); // Use 'new' keyword

    const serviceExists = user.savedServices.some((id) =>
      id.equals(serviceObjectId)
    );
    const updatedServices = serviceExists
      ? user.savedServices.filter((id) => !id.equals(serviceObjectId))
      : [...user.savedServices, serviceObjectId];

    user.savedServices = updatedServices;
    await user.save();

    res.status(200).json({
      message: `Service ${serviceExists ? "removed" : "saved"} successfully`,
      isSaved: !serviceExists,
      services: user.savedServices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const checkSavedService = async (req, res) => {
  const { serviceId } = req.query; // This is a string
  // console.log("sesion user:", req.session);

  if (!req.session.user) {
    return res.status(404).json({
      message: "User not found, please check and login/register if required.",
    });
  }
  const { userId } = req.session.user;

  // console.log("service id check:", serviceId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serviceObjectId = new mongoose.Types.ObjectId(serviceId); // Use 'new' keyword to create ObjectId

    const serviceExists = user.savedServices.some((id) =>
      id.equals(serviceObjectId)
    );

    res.status(200).json({
      message: "Service check successful",
      isSaved: serviceExists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

const getSavedServices = async (req, res) => {
  try {
    const { userId } = req.session.user;

    const user = await User.findById(userId).populate("savedServices").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Saved services fetched successfully",
      savedServices: user.savedServices,
    });
  } catch (error) {
    console.error("Error fetching saved services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteSingleSavedService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const { userId } = req.session.user;

    if (!serviceId || !userId) {
      return res
        .status(400)
        .json({ message: "Service ID and User ID are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedServices: serviceId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "Service removed successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error deleting saved service:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadServiceImage = async (req, res) => {
  // console.log("image uploading");
  try {
    const file = req.file;
    //   const {uploadedBy} = req.body;
    //   if (!uploadedBy) {
    //   return res.status(400).json({ error: "Missing user ID" });
    // }

    const temp = req.body.temp === "true";
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "services",
    });
    return res.status(200).json({
      message: "Image uploaded successfully",
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ error: "Image upload failed." });
  }
};

const deleteServiceImage = async (req, res) => {
  console.log("💥 Incoming delete request");

  try {
    const { public_id } = req.body;
    console.log("📩 Received public_id:", public_id || "[EMPTY OR MISSING]");

    if (!public_id) {
      console.log("❌ No public_id provided.");
      return res.status(400).json({ error: "Public ID is required." });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      console.log("✅ Image deleted:", public_id);
      return res.status(200).json({
        message: "Image deleted successfully",
        public_id: public_id,
      });
    } else {
      console.log("⚠️ Cloudinary deletion failed for:", public_id);
      return res.status(400).json({ error: "Failed to delete image." });
    }
  } catch (err) {
    console.error("❗️ Cloudinary delete error:", err);
    return res.status(500).json({ error: "Image deletion failed." });
  }
};

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

    // Ensure the user is authenticated
    if (!req.session?.user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to register a service.",
      });
    }

    // Validate required fields
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

    // Validate the service data (optional but good practice)
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
      createdBy: req.session.user.userId,
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
      if (isUpdated) {
        await categoryDoc.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: "Service registered successfully",
      data: {
        serviceId: newService._id,
        serviceName: newService.serviceName,
        category: newService.category,
        createdAt: newService.createdAt,
      },
    });
  } catch (error) {
    console.error("Service registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register service. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateService2 = async (req, res) => {
  console.time("Total Time");
  const { serviceId, imagesToBeDeleted, formData } = req.body;

  try {
    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required." });
    }

    const currentService = await Service.findById(serviceId);
    if (!currentService) {
      return res.status(404).json({ message: "Service not found." });
    }

    const currentImageMap = new Map(
      currentService.images.map((img) => [img._id.toString(), img.url])
    );

    const imagesToDeleteFromCloudinary = imagesToBeDeleted.filter((img) =>
      currentImageMap.has(img._id)
    );

    // Delete from Cloudinary if they exist in the service
    if (imagesToDeleteFromCloudinary.length > 0) {
      await Promise.all(
        imagesToDeleteFromCloudinary.map((img) => {
          const publicId = img.url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(`services/${publicId}`);
        })
      );
    }

    // Prepare the updated images (client sends final list)
    const finalImages = (formData.images || []).filter(
      (img) => !imagesToBeDeleted.find((delImg) => delImg._id === img._id)
    );

    // Build updated data object
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
      { new: true, runValidators: true }
    );

    console.timeEnd("Total Time");
    res.status(200).json({
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

module.exports = {
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
  updateServiceViews,
  toggleSaveService,
  checkSavedService,
  getSavedServices,
  deleteSingleSavedService,
  uploadServiceImage,
  deleteServiceImage,
  createService,
  updateService2,
};
