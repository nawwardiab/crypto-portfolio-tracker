import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const CustomButton = styled(Button)({
  marginTop: "10px",
  backgroundColor: "#007bff",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
});

export default CustomButton;
