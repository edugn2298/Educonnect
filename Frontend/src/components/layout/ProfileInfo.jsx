import {
  Box,
  Avatar,
  Button,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const Input = styled("input")({
  display: "none",
});

const ProfileInfo = ({ user, onSave, editable = false }) => {
  const [formData, setFormData] = useState({
    fullname: user.fullname || "",
    email: user.email || "",
    address: user.address || "",
    country: user.country || "",
    bio: user.bio || "",
    photo: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("email", formData.email);
    data.append("address", formData.address);
    data.append("country", formData.country);
    data.append("bio", formData.bio);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          borderRadius: 2,
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
          <Avatar
            src={user.profilePicture}
            alt={user.fullname}
            sx={{ width: 96, height: 96, mb: 2 }}
          />
          {editable && (
            <label htmlFor="photo-upload">
              <Input
                id="photo-upload"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
              <IconButton component="span">
                <EditIcon />
              </IconButton>
            </label>
          )}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
            mb: 4,
          }}
        >
          <TextField
            fullWidth
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              readOnly: !editable,
            }}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              readOnly: !editable,
            }}
            sx={{ gridColumn: "span 2" }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              readOnly: !editable,
            }}
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              readOnly: !editable,
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="Biography"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          InputProps={{
            readOnly: !editable,
          }}
        />
        {editable && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>
    </form>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  editable: PropTypes.bool,
};

export default ProfileInfo;
