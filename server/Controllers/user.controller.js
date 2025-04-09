const User = require("../Models/user.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const uap = require("ua-parser-js");
const {
  generateJWTToken,
  sendEmailVerificationMail,
  isEmailValidate,
  generateOTP,
  generateJWTTokenForPasswordReset,
  sendPasswordResetMail,
} = require("../Utils/auth");
const ShoutoutClient = require("shoutout-sdk");
const { default: mongoose } = require("mongoose");
const checkProfileCompletion = require("../Utils/checkProfileCompletion");
const Session = require("../Models/session.schema");

require("dotenv").config();

const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password, mobile } = req.body;

  //check if username or email exists
  const userEmailExists = await User.findOne({ email });
  if (userEmailExists) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(409).json({
      success: false,
      message: "username already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

  const userObj = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    mobile,
  });

  try {
    const userDb = await userObj.save();
    const verifiedToken = generateJWTToken(email, username);
    sendEmailVerificationMail({ email, verifiedToken });
    console.log("userDB:", userDb);
    return res.status(200).json({
      message: "Email verification sent, verify email and login",
      user: userDb,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
};

const sendResetPasswordLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const verifiedToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      user.resetPasswordToken = verifiedToken;
      user.resetPasswordExpires = Date.now() + 3600000;
      await user.save();
      // const verifiedToken = generateJWTTokenForPasswordReset(email);
      await sendPasswordResetMail({ email, verifiedToken });

      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and password required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT)
    );
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const verifyUser = async (req, res) => {
  const { email, username } = jwt.verify(
    req.params.token,
    process.env.JWT_SECRET_KEY
  );
  console.log("verified token:", email, username);

  try {
    await User.findOneAndUpdate({ email }, { isEmailVerified: true });
    return res.status(200).json({
      message: "email verified",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

const verifyPasswordReset = async (req, res) => {};

const loginUser = async (req, res) => {
  //loginId: email || username
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.status(400).json({
      message: "Missing user credentials",
    });
  }

  if (!isEmailValidate && loginId.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "invalid email format",
    });
  }

  const user = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }],
  }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Email not verified, Please verify your email to proceed.",
    });
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password",
    });
  }

  let ua = uap(req.headers["user-agent"]);

  console.log("user agebt:", ua);

  req.session.isAuth = true;
  req.session.userAgent = ua;

  req.session.user = {
    userId: user._id,
    email: user.email,
    username: user.username,
  };
  return res.status(200).json({
    success: true,
    message: "User logged in successfuly",
    user: req.session.user,
  });
};

const verifyMobile = async (req, res) => {
  const { mobile } = req.body;
  const client = new ShoutoutClient(process.env.OTP_API_KEY, true, false);
  const otp = generateOTP();
  const message = {
    source: "ShoutDEMO",
    destinations: [mobile],
    content: {
      sms: `Your Home-Help OTP verification code is: ${otp}`,
    },
    transports: ["sms"],
  };
  try {
    client.sendMessage(message, (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Error in sending OTP",
          error,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "OTP sent successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error in sending OTP",
      error,
    });
  }
};

const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(500).json({
        message: "Logout unsuccessfull",
        error: err,
      });
    res.clearCookie("connect.sid", {
      path: "/", // Ensure the path matches the one used in session config
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  });
};

const logoutFromAllDevice = async (req, res) => {
  // console.log("session req:", req.session);
  const { userId } = req.session.user;

  try {
    const deleteDb = await Session.deleteMany({
      "session.user.userId": userId,
    });
    console.log("deletedDB: ", deleteDb);
    res.clearCookie("connect.sid", {
      path: "/", // Ensure the path matches the one used in session config
    });
    return res.status(200).json({
      success: true,
      message: "Logout successfull",
    });

    // res.redirect(`${process.env.REDIRECT_LINK}`);
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error,
    });
  }
};

// const authCheck = async(req, res)=>{
//   console.log("auth check:", req.session)
//   if(req.session.user){
//     console.log("no error in auth")
//     res.status(200).json({success:true,user:req.session.user})
//   }else{
//     console.log("error in auth")
//     res.status(401).json({message:"Not authenticated"})
//   }
// }
const authCheck = async (req, res) => {
  try {
    if (req.session.user) {
      res.status(200).json({
        success: true,
        user: req.session.user,
      });
    } else {
      res.status(200).json({
        success: false,
        message: "User not authenticated",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const saveUserCurrLocation = async (req, res) => {
  // console.log("session user:", req.session);
};

const getUserDetails = async (req, res) => {
  if (!req.session.user) {
    return res.status(404).json({
      message: "user not found",
    });
  }
  const { userId } = req.session.user;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({
        message: "user found",
        user,
      });
    } else {
      return res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};

const updateUserInfo = async (req, res) => {
  const { userId } = req.session.user;
  const updates = req.body;

  if (!userId) {
    return res
      .status(401)
      .send({ error: "Unauthorized: No user session found" });
  }

  const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "dateOfBirth",
    "mobile",
    "whatsapp",
    "bio",
  ];
  const sanitizedUpdates = {};

  for (const key of Object.keys(updates)) {
    if (allowedUpdates.includes(key)) {
      sanitizedUpdates[key] = updates[key];
    }
  }

  if (!Object.keys(sanitizedUpdates).length) {
    return res.status(400).send({ error: "Invalid updates provided" });
  }

  try {
    // First, find the existing user to check current profile status
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    // Merge existing user data with new updates
    const updatedUserData = {
      ...existingUser.toObject(),
      ...sanitizedUpdates,
    };

    // Check profile completion based on merged data
    const isProfileCompleted = checkProfileCompletion(updatedUserData);

    // Update user with new data and profile completion status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...sanitizedUpdates,
        isProfileCompleted: isProfileCompleted,
      },
      { new: true }
    );

    res.status(200).json({
      message: "User info updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", {
      userId,
      updates: sanitizedUpdates,
      error: error.message,
    });
    res.status(500).send({ error: "Error updating user details" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currPassword, newPassword } = req.body;

    const { userId } = req.session.user;
    if (!currPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required." });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    // Find the user by ID
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("user:", user);

    // verify current password
    const isPasswordCorrect = await bcrypt.compare(currPassword, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT)
    );
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.log("pass error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }

  // const isMatched = await bcrypt.compare(password, user.password);
  // const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
};

const activeSessions = async (req, res) => {
  const session = req.session;

  // Ensure userId exists
  if (!session.user || !session.user.userId) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  const { userId } = session.user;

  try {
    const now = new Date();
    const userActiveSessions = await Session.find({
      "session.user.userId": userId,
      expires: { $gt: now }, // Ensure the session has not expired
    });

    // Return the active sessions
    return res.json({
      activeSessions: userActiveSessions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  verifyMobile,
  logoutUser,
  logoutFromAllDevice,
  authCheck,
  saveUserCurrLocation,
  getUserDetails,
  updateUserInfo,
  changePassword,
  activeSessions,
  forgotPassword,
  sendResetPasswordLink,
  verifyPasswordReset,
  resetPassword,
};
