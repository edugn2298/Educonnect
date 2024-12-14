import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-navbar-bg text-navbar-text"></nav>
    </>
  );
};
