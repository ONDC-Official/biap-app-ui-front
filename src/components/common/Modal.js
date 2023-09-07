import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiModel from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { styled } from "@mui/material/styles";

const style = {
  position: "absolute",
  overflow: "auto",
  display: "block",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "40%",
  maxHeight: "100%",
  backgroundColor: "background.paper",
  border: "1px solid #D9D9D9",
  borderRadius: "8px",
  // p: 4,
  // pt: 2
};

const styleFullscreen = {
  position: "fixed",
  overflow: "auto",
  display: "flex",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "100%",
  maxHeight: "100%",
  minHeight: "100%",
  backgroundColor: "background.paper",
  border: "1px solid #D9D9D9",
  borderRadius: "0px",
  flexDirection: "column",
  // p: 4,
  // pt: 2
};
const styleHeader = {
  backgroundColor: "background.paper",
  p: 3,
  borderBottom: "1px solid #BCE5FC !important",
};
const styleContainer = {
  backgroundColor: "background.paper",
  p: 3,
  mt: 0,
  overflowY: "auto",
};
const styleFullScreenContainer = {
  backgroundColor: "background.paper",
  p: 3,
  mt: 2,
  mb: 6,
  overflowY: "auto",
};
const Modal = styled(MuiModel)(() => ({
  overflow: "hidden",
}));

const ModalComponent = ({ sx, children, title, open, onClose, fullWidth = false }) => {
  return (
    <div>
      <Modal
        title={title}
        open={open}
        // onClose={onClose}
      >
        <Box sx={fullWidth ? styleFullscreen : style}>
          {title && (
            <Box sx={styleHeader}>
              <Typography variant="h6" component="h2">
                {title}
                {onClose && <CloseRoundedIcon style={{ float: "right", cursor: "pointer" }} onClick={onClose} />}
              </Typography>
            </Box>
          )}
          <Box sx={fullWidth ? styleFullScreenContainer : styleContainer}>{children}</Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;
