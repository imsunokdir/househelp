import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

const TestServiceForm = () => {
  const [location, setLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const handlePlaceSelect = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setLocation(place.formatted_address);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        // Optional: Use a reverse geocoding API to convert lat/long to an address
      },
      (error) => {
        alert("Unable to retrieve location.");
        console.error(error);
      }
    );
  };

  return (
    <form className="service-form">
      <div>
        <label htmlFor="location">Your Location</label>
        <div className="location-input">
          <Autocomplete
            onLoad={(autocomplete) => (window.autocomplete = autocomplete)}
            onPlaceChanged={() => handlePlaceSelect(window.autocomplete)}
          >
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Autocomplete>
          <button
            type="button"
            className="use-location-btn"
            onClick={handleUseCurrentLocation}
          >
            Use My Current Location
          </button>
        </div>
        {currentLocation && <p>Current Location: {currentLocation}</p>}
      </div>

      {/* Additional form fields */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default TestServiceForm;
