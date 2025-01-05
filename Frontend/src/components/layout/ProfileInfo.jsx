import { Box, Avatar, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

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
    console.log("Form Data desde profile info:", data);
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box className="p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <Box className="flex justify-center mb-6">
          <Avatar
            src={user.profilePicture}
            alt={user.fullname}
            className="w-24 h-24"
          />
          {editable && (
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          )}
        </Box>
        <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
          <Box className="flex flex-col">
            <Typography
              variant="subtitle1"
              className="mb-2 text-black dark:text-white"
            >
              Full Name
            </Typography>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={`border-2 ${
                editable
                  ? "border-black dark:border-white"
                  : "border-transparent"
              } text-black dark:text-white bg-transparent rounded-lg p-2`}
              readOnly={!editable}
            />
          </Box>
          <Box className="flex flex-col">
            <Typography
              variant="subtitle1"
              className="mb-2 text-black dark:text-white"
            >
              Email Address
            </Typography>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border-2 ${
                editable
                  ? "border-black dark:border-white"
                  : "border-transparent"
              } text-black dark:text-white bg-transparent rounded-lg p-2`}
              readOnly={!editable}
            />
          </Box>
          <Box className="flex flex-col">
            <Typography
              variant="subtitle1"
              className="mb-2 text-black dark:text-white"
            >
              Address
            </Typography>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`border-2 ${
                editable
                  ? "border-black dark:border-white"
                  : "border-transparent"
              } text-black dark:text-white bg-transparent rounded-lg p-2`}
              readOnly={!editable}
            />
          </Box>
          <Box className="flex flex-col">
            <Typography
              variant="subtitle1"
              className="mb-2 text-black dark:text-white"
            >
              Country
            </Typography>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`border-2 ${
                editable
                  ? "border-black dark:border-white"
                  : "border-transparent"
              } text-black dark:text-white bg-transparent rounded-lg p-2`}
              readOnly={!editable}
            />
          </Box>
        </Box>
        <Box className="flex flex-col">
          <Typography
            variant="subtitle1"
            className="mb-2 text-black dark:text-white"
          >
            Biography
          </Typography>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className={`border-2 ${
              editable ? "border-black dark:border-white" : "border-transparent"
            } text-black dark:text-white bg-transparent rounded-lg p-2`}
            readOnly={!editable}
          />
        </Box>
        {editable && (
          <Box className="flex justify-end mt-4">
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Box>
        )}
      </Box>
    </form>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  editable: PropTypes.bool,
};

export default ProfileInfo;
