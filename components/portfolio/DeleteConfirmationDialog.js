// components/DeleteConfirmationDialog.js

// Import necessary components from Material UI
import {
  Dialog, // Modal dialog container
  DialogActions, // Container for dialog action buttons
  DialogContent, // Container for the main content of the dialog
  DialogContentText, // Text inside the dialog
  DialogTitle, // Title of the dialog
  Button, // Button component from Material UI
} from "@mui/material";

// Delete confirmation dialog component
// Props:
// - open: Boolean to control the visibility of the dialog
// - onClose: Function to close the dialog without deleting
// - onDelete: Function to execute the deletion action
const DeleteConfirmationDialog = ({ open, onClose, onDelete }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {" "}
      {/* Open the dialog when 'open' is true */}
      <DialogTitle>Confirm Delete</DialogTitle> {/* Dialog header */}
      <DialogContent>
        {/* Message prompting the user for confirmation */}
        <DialogContentText>
          Are you sure you want to delete this asset from your portfolio?
        </DialogContentText>
      </DialogContent>
      {/* Actions section with Cancel and Delete buttons */}
      <DialogActions>
        {/* Cancel button - closes the dialog without deleting */}
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        {/* Delete button - triggers the onDelete function to confirm deletion */}
        <Button onClick={onDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog; // Export component for use in other parts of the app
