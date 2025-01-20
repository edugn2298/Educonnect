import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  Home,
  People,
  Person,
  Subscriptions,
  Message,
  ExitToApp,
  Brightness4,
  Brightness7,
  ChevronLeft,
  ChevronRight,
  Comment,
  DynamicFeed,
} from "@mui/icons-material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import logo from "../../assets/logo.png";
import smallLogo from "../../assets/smallLogo.png";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const isAdmin = currentUser.role === "admin";

  const location = useLocation();

  const adminIconItems = [
    { icon: <Home />, path: "/admin/dashboard", text: "Admin" },
    { icon: <People />, path: "/admin/users", text: "Users" },
    {
      icon: <Subscriptions />,
      path: "/admin/subscriptions",
      text: "Subscriptions",
    },
    { icon: <Message />, path: "/admin/messages", text: "Messages" },
    { icon: <DynamicFeed />, path: "/admin/posts", text: "Posts" },
    {
      icon: <Comment />,
      path: "/admin/comments",
      text: "Comments",
    },
    {
      icon: <AccountBalanceWalletIcon />,
      path: "/admin/transactions",
      text: "Transactions",
    },
  ];

  const menuItems = [
    { icon: <Home />, path: "/feed", text: "Feed" },
    { icon: <People />, path: "/friends", text: "Friends" },
    { icon: <Person />, path: `/profile/${currentUser._id}`, text: "Profile" },
    { icon: <Subscriptions />, path: "/subscriptions", text: "Subscriptions" },
    { icon: <Message />, path: "/messages", text: "Messages" },
    {
      icon: <AccountBalanceWalletIcon />,
      path: "/transactions",
      text: "Transactions",
    },
  ];

  const allMenuItems = showAdminOptions ? adminIconItems : menuItems;

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    setShowAdminOptions(isAdmin && isAdminRoute);
  }, [location, isAdmin]);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: 80, md: collapsed ? 80 : 240 },
          height: "100vh",
          boxSizing: "border-box",
          position: "sticky",
          transition: "width 0.3s ease-in-out",
          bgcolor:
            theme === "light" ? "background.default" : "background.paper",
          color: theme === "light" ? "text.primary" : "text.secondary",
          overflowY: "auto",
          overflowX: "hidden", // Evitar el desbordamiento horizontal
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor:
            theme === "light" ? "background.default" : "background.paper",
          color: theme === "light" ? "text.primary" : "text.secondary",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={smallLogo}
            alt="small logo"
            sx={{
              width: "40px",
              display: { xs: "block", md: collapsed ? "block" : "none" },
            }}
          />
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              display: { xs: "none", md: collapsed ? "none" : "block" },
              width: "100%",
              maxWidth: "100%", // Ajustar el ancho máximo al 100% del contenedor
            }}
          />
          <IconButton
            onClick={handleCollapse}
            sx={{
              position: "absolute",
              right: 8,
              display: { xs: "none", md: "block" },
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ flexGrow: 1 }}>
          {allMenuItems.map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right">
              <ListItem
                button
                component={Link}
                to={item.path}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: {
                    xs: "center",
                    md: collapsed ? "center" : "flex-start",
                  },
                  p: { xs: 1, md: collapsed ? 1 : 1.5 },
                  overflow: "hidden", // Evitar el desbordamiento de texto
                  whiteSpace: "nowrap", // Evitar el salto de línea
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: { md: collapsed ? 0 : 2 },
                    justifyContent: "center",
                    color:
                      theme === "light" ? "text.primary" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    display: { xs: "none", md: collapsed ? "none" : "block" },
                    color:
                      theme === "light" ? "text.primary" : "text.secondary",
                  }}
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
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
              color: theme === "light" ? "grey.500" : "white",
              mb: 1,
            }}
          >
            {theme === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
          {isAdmin && ( // Mostrar solo si el usuario es admin
            <IconButton
              variant="contained"
              color="primary"
              onClick={() => setShowAdminOptions(!showAdminOptions)}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Avatar
            src={currentUser.profilePicture}
            alt={currentUser.fullname}
            sx={{ width: 56, height: 56, mb: 1 }}
          />
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              display: { xs: "none", md: collapsed ? "none" : "block" },
            }}
          >
            {currentUser.fullname.length > 20
              ? `${currentUser.fullname.slice(0, 20)}...`
              : currentUser.fullname}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              display: { xs: "none", md: collapsed ? "none" : "block" },
            }}
          >
            @{currentUser.username}
          </Typography>
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
          <Button
            variant="contained"
            color="secondary"
            onClick={logout}
            startIcon={<ExitToApp />}
            sx={{
              display: { xs: "none", md: collapsed ? "none" : "block" },
              width: "100%",
              p: 1, // Reducir el tamaño del botón en modo desktop
              fontSize: 14, // Ajustar el tamaño de la fuente
            }}
          >
            Log Out
          </Button>
          <IconButton
            onClick={logout}
            sx={{
              color: theme === "light" ? "grey.500" : "white",
              display: { xs: "block", md: collapsed ? "block" : "none" },
            }}
          >
            <ExitToApp />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
