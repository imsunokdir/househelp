// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const Service = require("./service.schema");
const User = require("./user.schema");

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

const saveServiceField = async () => {
  console.log("hello");
  try {
    const result = await User.updateMany(
      {},
      { $set: { savedServices: [] } } // Set savedServices to an empty array
    );

    console.log(
      `Updated ${result.nModified} user documents to add the savedServices field.`
    );
  } catch (error) {
    console.error("Error updating user documents:", error);
  }
};

// const testDb = async () => {
//   console.log("hello from test.");
// };

module.exports = {
  schemaUpdate,
  serviceStatusUpdate,
  saveServiceField,
};
