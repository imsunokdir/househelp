//   const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
//   const sessionModel = mongoose.model("session", sessionSchema);

const { default: mongoose } = require("mongoose");

const sessionSchema = new mongoose.Schema({ _id: String }, { strict: false });
const Session = mongoose.model("session", sessionSchema);

module.exports = Session;
