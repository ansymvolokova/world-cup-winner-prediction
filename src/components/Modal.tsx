import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { Button, TextField } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
  display: "flex",
  flexDirection: "column",
};

type BaseModalProps = {
  open: boolean;
  handleClose: () => void;
  submit: (name: string) => void;
};

export const BasicModal = ({ open, handleClose, submit }: BaseModalProps) => {
  const [name, setName] = useState<string>("");
  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Please enter your name
        </Typography>

        <TextField
          id="outlined-basic"
          label="Enter your name"
          variant="outlined"
          sx={{ marginTop: "1rem" }}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Button
          variant="contained"
          onClick={() => submit(name)}
          disabled={!name.length}
          sx={{ marginTop: "1rem" }}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};
