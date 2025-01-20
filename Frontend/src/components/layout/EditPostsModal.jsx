import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Modal,
  Divider,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Delete from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const EditPostModal = ({ open, handleClose, post, handleEdit }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [initialContent, setInitialContent] = useState("");
  const [initialMedia, setInitialMedia] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (post && typeof post === "object") {
      setContent(post.content);
      setInitialContent(post.content);
      if (post.media && post.media[0]) {
        setMedia(post.media[0]);
        setInitialMedia(post.media[0]);
        setImagePreview(post.media[0]);
      } else {
        setMedia(null);
        setInitialMedia(null);
        setImagePreview(null);
      }
    }
  }, [post]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setMedia(null);
    setImagePreview(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (content !== initialContent || media !== initialMedia) {
      const formData = new FormData();
      formData.append("content", content);
      if (media) {
        formData.append("image", media);
      }
      try {
        await handleEdit(post._id, formData);
        handleClose();
      } catch (error) {
        console.error(error);
      }
    } else {
      handleClose(); // Close modal if no changes were made
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 600,
          width: "100%",
          mx: "auto",
          mt: 4,
          position: "relative",
          overflowY: "auto",
          maxHeight: "80vh", // Limitar la altura del modal
        }}
        onSubmit={handleSave}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: theme.palette.text.primary,
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h2"
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Editar Post
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder="¿Qué estás pensando?"
          value={content}
          onChange={handleContentChange}
          sx={{ mb: 2 }}
          InputProps={{
            sx: {
              color: theme.palette.text.primary,
            },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <label htmlFor="upload-image">
            <Input
              accept="image/*"
              id="upload-image"
              type="file"
              onChange={handleMediaChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          {imagePreview && (
            <IconButton
              color="secondary"
              aria-label="remove image"
              component="span"
              onClick={handleRemoveImage}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
        {imagePreview && (
          <Box sx={{ mb: 2 }}>
            <img
              src={
                typeof imagePreview === "string"
                  ? imagePreview
                  : URL.createObjectURL(imagePreview)
              }
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "50vh", // Limitar la altura de la imagen
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

EditPostModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default EditPostModal;
