import React, { useState } from "react";
import { Button, Box, TextField, Typography } from "@mui/material";

export const QRCodePrinter = ({ qrCodeData }) => {
  const [size, setSize] = useState(128); // Default size in pixels

  const printQRCode = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
        </head>
        <body>
          <img src="${qrCodeData}" style="width: ${size}px; height: ${size}px;" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box>
      {/* <Typography variant="h6">QR Code Printer</Typography> */}
      <Box>
        <TextField
          label="Size (px)"
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          inputProps={{ min: 50, step: 10 }}
        />
        <Button variant="contained" color="primary" onClick={printQRCode}>
          Print QR Code
        </Button>
      </Box>
      <Box mt={2}>
        <img src={qrCodeData} alt="QR Code" style={{ width: size, height: size }} />
      </Box>
    </Box>
  );
};
