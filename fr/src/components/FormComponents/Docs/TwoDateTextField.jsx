import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const TwoDateTextField = ({ handleNext, handleBack, formData = {}, setFormData }) => {
  const [selectedDate1, setSelectedDate1] = React.useState(formData.date1 || "");
  const [selectedDate2, setSelectedDate2] = React.useState(formData.date2 || "");

  const handleDate1Change = (e) => {
    const date1Value = e.target.value;
    setSelectedDate1(date1Value);
    setFormData((prevFormData) => ({ ...prevFormData, date1: date1Value }));
  };

  const handleDate2Change = (e) => {
    const date2Value = e.target.value;
    setSelectedDate2(date2Value);
    setFormData((prevFormData) => ({ ...prevFormData, date2: date2Value }));
  };

  return (
    <div>
      <Typography>Выберите две даты</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="date1"
          label="Дата 1"
          type="date"
          value={selectedDate1}
          onChange={handleDate1Change}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="date2"
          label="Дата 2"
          type="date"
          value={selectedDate2}
          onChange={handleDate2Change}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{ mr: 1 }}
          disabled={!selectedDate1 || !selectedDate2}
        >
          Continue
        </Button>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
      </Box>
    </div>
  );
};

export default TwoDateTextField