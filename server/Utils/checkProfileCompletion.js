const checkProfileCompletion = (updates) => {
  const requiredFields = ["firstName", "mobile", "whatsapp"];

  return requiredFields.every(
    (field) =>
      updates[field] !== undefined &&
      updates[field] !== null &&
      updates[field] !== ""
  );
};

module.exports = checkProfileCompletion;
