// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const Service = require("./service.schema");

const schemaUpdate = async () => {
  try {
    const result = await Service.updateMany({}, { $set: { views: 0 } });
    console.log(
      `Updated ${result.modifiedCount} documents to include the 'views' field.`
    );
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};

const serviceStatusUpdate = async () => {
  try {
    const result = await Service.updateMany({}, { $set: { status: "Active" } });
  } catch (error) {
    console.log(`Updated documents`);
  }
};

module.exports = { schemaUpdate, serviceStatusUpdate };
