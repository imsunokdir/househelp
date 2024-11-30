import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const UserDetails = ({ service }) => {
  const handleWhatsAppClick = () => {
    const message = "HOla";
    const url = `https://wa.me/${
      service.createdBy.mobile
    }?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full h-40 mt-3 p-3 rounded bg-green-100">
      <p>Name: raj</p>
      <p>From: Dwarka, new delhi</p>
      <p>Age: 35</p>
      <div className="fixed bottom-0 left-0 w-full p-1 flex justify-between items-center shadow-md border-t-2">
        <div className=" px-4 py-2 hover:bg-blue-200 w-1/2 flex justify-center items-center">
          <p className="p-0 m-0">
            <FontAwesomeIcon
              icon={faPhone}
              size="2x"
              style={{ color: "blue", marginRight: "7px" }}
            />
          </p>
          <p className="p-0 m-0">Call</p>
        </div>

        <div
          className=" px-4 py-2 hover:bg-blue-200 w-1/2 flex justify-center items-center"
          onClick={handleWhatsAppClick}
        >
          <p className="p-0 m-0">
            <FontAwesomeIcon
              icon={faWhatsapp}
              size="2x"
              style={{ color: "#25D366", marginRight: "7px" }}
            />
          </p>
          <p className="p-0 m-0">WhatsApp</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
