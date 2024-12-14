import { fetchServiceByCategory } from "../services/service";

export const fetchServiceFunc = async ({
  userLocation,
  categoryId,
  page = 1,
  limit = 5,
  filterData = null,
  source,
}) => {
  try {
    const longitude = userLocation.coordinates[0];
    const latitude = userLocation.coordinates[1];

    if (!longitude || !latitude) {
      throw new Error("User location coordinates are missing.");
    }

    console.log("userLocation", userLocation);
    console.log("categortId:", categoryId);
    console.log("page", page);
    console.log("limit", limit);
    console.log("filterData", filterData);

    // Make the API call
    const response = await fetchServiceByCategory(
      categoryId,
      page,
      limit,
      longitude,
      latitude,
      filterData,
      source?.token // Use source.token if source exists
    );

    return response;
  } catch (error) {
    console.error("Error fetching services:", error.message || error);
    return { error: error.message || "Something went wrong." };
  }
};
