import PropTypes from "prop-types";
import { TextField, InputAdornment, IconButton, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch, value }) => {
  const theme = useTheme();
  const handleChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Buscar..."
      value={value}
      onChange={handleChange}
      sx={{
        marginBottom: "16px",
        "& .MuiInputBase-root": {
          backgroundColor: theme.palette.background.paper,
          borderRadius: "4px",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon />,
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default SearchBar;
