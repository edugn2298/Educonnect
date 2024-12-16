import { api } from "./api";

export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const response = await api.post("/auth/user/register", {
      username,
      email,
      password,
      role,
    });
    return response;
  } catch (error) {
    if (error.response.status === 409) {
      res.status(409).send({ error: "Username or email already in use." });
    } else {
      res.status(400).send(error);
    }
  }
};

export const login = async (emailOrUsername, password) => {
  try {
    const response = await api.post("/auth/user/login", {
      emailOrUsername,
      password,
    });
    console.log("Response:", response);
    return response;
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/user/logout");
  } catch (error) {
    console.error("Error during logout", error);
    throw error;
  }
};
