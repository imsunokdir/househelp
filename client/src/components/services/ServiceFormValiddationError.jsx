import React from "react";

const ServiceFormValiddationError = (params) => {
  const { errors } = params;
  return (
    errors && (
      <div className="space-y-2">
        <label
          htmlFor="error"
          className="block text-sm font-medium text-gray-700 text-red-500"
        >
          Errors:
        </label>
        {errors.map((err, i) => (
          <p key={i}>{err}</p>
        ))}
      </div>
    )
  );
};

export default ServiceFormValiddationError;
