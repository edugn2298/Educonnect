import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { TextField, Button, IconButton, Box } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Delete from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { createPost } from "../../services/PostRequest";
import { AuthContext } from "../../context/AuthContext";

const Input = styled("input")({
  display: "none",
});

const PostCreator = ({ onSubmit }) => {
  const { currentUser } = useContext(AuthContext);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("author", currentUser._id);
    formData.append("content", text);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    console.log(JSON.stringify(formData.entries()));
    try {
      const response = await createPost(formData);
      // Llamar a onSubmit con éxito
      onSubmit(true, response.data.message);
      // Reset form
      setText("");
      setImage(null);
      setImageFile(null);
    } catch (error) {
      console.error(error);
      // Llamar a onSubmit con error
      onSubmit(false, "Hubo un error al crear el post.");
    }
  };

  return (
    <Box
      component="form"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        p: 4,
        borderRadius: 1,
        boxShadow: 3,
        maxWidth: 600,
        width: "100%",
        mx: "auto",
        mb: 4,
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="¿Qué estás pensando?"
        value={text}
        onChange={handleTextChange}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <label htmlFor="upload-image">
          <Input
            accept="image/*"
            id="upload-image"
            type="file"
            onChange={handleImageChange}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        {image && (
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
      {image && (
        <Box sx={{ mb: 2 }}>
          <img
            src={image}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      )}
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Post It
      </Button>
    </Box>
  );
};

PostCreator.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default PostCreator;
