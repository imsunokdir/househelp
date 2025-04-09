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

const addPasswordResetFields = async (req, res) => {
  try {
    // Update all users by setting the fields if they don't already exist
    const result = await User.updateMany(
      {},
      {
        $set: {
          resetPasswordToken: { type: String, default: null },
          resetPasswordExpires: { type: Date, default: null },
        },
      }
    );
    console.log("result:", result);
    res
      .status(200)
      .json({ message: "Fields added to all users successfully." });
  } catch (error) {
    console.error("Error updating users:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// const testDb = async () => {
//   console.log("hello from test.");
// };

module.exports = {
  schemaUpdate,
  serviceStatusUpdate,
  saveServiceField,
  addPasswordResetFields,
};
