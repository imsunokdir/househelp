import React from "react";
import { motion } from "framer-motion";
import { Done, DoneAll } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const PasswordChangeSuccess = () => {
  return (
    <motion.div
      //   initial={{ x: "100vw", opacity: 0 }} // Start off-screen (right side)
      //   animate={{ x: 0, opacity: 1 }} // Move to the original position
      //   transition={{
      //     type: "spring",
      //     stiffness: 50,
      //     damping: 20,
      //     duration: 0.3,
      //   }}
      className="box flex flex-col items-center mt-3"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: [0, 0.6, 0.2, 1.01],
      }}
    >
      <div>
        <FontAwesomeIcon
          icon={faCircleCheck}
          bounce
          size="xl"
          style={{ color: "#63E6BE", height: "50px" }}
        />
      </div>
      <p>Password changed successfully</p>
    </motion.div>
  );
};

export default PasswordChangeSuccess;
