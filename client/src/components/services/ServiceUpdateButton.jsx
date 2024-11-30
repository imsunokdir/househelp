import { Button, CircularProgress } from "@mui/material";
import React from "react";

const ServiceUpdateButton = (params) => {
  const { isUpdating } = params;
  return isUpdating ? (
    <Button
      fullWidth
      variant="contained"
      //   sx={{ mt: 3, mb: 2 }}
      //   type="submit"
      disabled={true}
      className="py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    >
      <CircularProgress
        size="1.5rem"
        sx={{
          color: "white",
        }}
      />
    </Button>
  ) : (
    <Button
      fullWidth
      variant="contained"
      // sx={{ mt: 3, mb: 2 }}
      type="submit"
      className="py-3 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    >
      Submit
    </Button>
  );
};

export default ServiceUpdateButton;
