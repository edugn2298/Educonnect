import { useState, useEffect, useRef } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import ProfileCard from "../../../components/layout/ProfileCard";
import ProfileInfo from "../../../components/layout/ProfileInfo";
import { Button, Box } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { getUser, updateUser } from "../../../services/auth";

export const EditProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const hasFetchedUserDetails = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUser(currentUser._id);
        console.log(response);
        setUserDetails(response);
        setCurrentUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!hasFetchedUserDetails.current && currentUser) {
      fetchUserDetails();
      hasFetchedUserDetails.current = true;
      setIsLoading(false);
    }
  }, [currentUser, setCurrentUser]);

  console.log("User details:", userDetails);

  const handleSave = async (updatedUser) => {
    console.log(updatedUser);
    try {
      const response = await updateUser(currentUser._id, updatedUser);
      setUserDetails(response);
      setIsEditing(false);
      if (response.data) {
        console.log("User details updated successfully:", response.data);
      }
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
      }}
      className="bg-gradient-to-r from-indigo-400 to-cyan-400 dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700"
    >
      <Sidebar />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          p: 4,
        }}
      >
        <ProfileCard user={userDetails?.data || currentUser} />
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mt-4">
          Edit Profile
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          userDetails && (
            <ProfileInfo
              user={userDetails.data}
              onSave={handleSave}
              editable={isEditing}
            />
          )
        )}
        <div className="flex justify-end m-4">
          <Button
            variant="contained"
            color="primary"
            className="mr-2"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          <Button variant="contained" color="primary">
            Change Password
          </Button>
          <Button variant="contained" color="primary">
            Log Out
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default EditProfile;
