import { Link } from "react-router-dom";
import { Drawer, Box, Button, Divider, IconButton } from "@mui/material";
import {
  Home,
  People,
  Person,
  Subscriptions,
  Message,
  Settings,
  ExitToApp,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import logo from "../../assets/logo.png";
import smallLogo from "../../assets/smallLogo.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    { icon: <Home />, path: "/feed", text: "Feed" },
    { icon: <People />, path: "/friends", text: "Friends" },
    { icon: <Person />, path: "/profile", text: "Profile" },
    { icon: <Subscriptions />, path: "/subscriptions", text: "Subscriptions" },
    { icon: <Message />, path: "/messages", text: "Messages" },
    { icon: <Settings />, path: "/settings", text: "Settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: 80, md: 240 },
          height: "100vh",
          boxSizing: "border-box",
          position: "sticky",
          transition: "all 0.3s ease-in-out",
        },
      }}
      className={" bg-white text-black dark:bg-gray-800 dark:text-white"}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          ...(theme === "light"
            ? { bgcolor: "background.default", color: "text.primary" }
            : { bgcolor: "background.paper", color: "text.secondary" }),
        }}
        className={" bg-white text-black dark:bg-gray-800 dark:text-white"}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={smallLogo} alt="small logo" className="lg:hidden w-16" />
          <img src={logo} alt="logo" className="hidden lg:block w-full" />
        </Box>
        <Divider />
        <Box sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                width: "100%",
                textTransform: "none",
                ...(theme === "light"
                  ? { color: "text.primary" }
                  : { color: "text.secondary" }),
              }}
              className={"text-black dark:text-white"}
            >
              {item.icon}
              <span className="hidden lg:block ml-2">{item.text}</span>
            </Button>
          ))}
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={toggleTheme}
            sx={{
              ...(theme === "light"
                ? { color: "grey.500" }
                : { color: "white" }),
            }}
          >
            {theme === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button variant="contained" color="secondary" onClick={logout}>
            <ExitToApp />
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
