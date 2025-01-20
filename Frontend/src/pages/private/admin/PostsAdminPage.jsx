import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, TextField } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import PaginatedTable from "../../../components/PaginatedTable";
import { getFilteredPosts } from "../../../services/postRequest";

const PostsAdminPage = () => {
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 10,
    filter: {},
  });

  const handleEdit = (row) => {
    console.log("Edit row:", row);
    // Lógica para editar el usuario
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
    // Lógica para eliminar el usuario
  };

  const columns = [
    { field: "author.username", headerName: "Author" },
    { field: "content", headerName: "Content" },
    { field: "media", headerName: "Media" },
    { field: "createdAt", headerName: "Creation Date" },
    { field: "likes", headerName: "Likes" },
    { field: "comments", headerName: "Comments" },
    {
      field: "actions",
      headerName: "Actions",
      handleEdit: handleEdit,
      handleDelete: handleDelete,
    },
  ];

  if (pageState.data.length > 0) {
    console.log("pageState:", pageState.data[0]);
    console.log("username:", pageState.data[0].author.username);
    console.log("profilePicture:", pageState.data[0].author.profilePicture);
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      setPageState((old) => ({ ...old, isLoading: true }));
      try {
        const response = await getFilteredPosts({
          ...pageState.filter,
          page: pageState.page + 1,
          limit: pageState.pageSize,
        });
        console.log("Data fetched:", response.data.docs);
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: response.data.docs,
          total: response.data.totalDocs,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setPageState((old) => ({ ...old, isLoading: false }));
      }
    };

    fetchData();
  }, [pageState.page, pageState.pageSize, pageState.filter]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPageState((old) => ({
      ...old,
      filter: { ...old.filter, [name]: value },
    }));
  };

  const handlePageChange = (event, newPage) => {
    console.log("Page changed to:", newPage);
    setPageState((old) => ({ ...old, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    console.log("Page size changed to:", event.target.value);
    setPageState((old) => ({
      ...old,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to right, #2e3b55, #243b4d)"
            : "linear-gradient(to right, #4b6cb7, #182848)",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Post Admin
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="Content"
            variant="outlined"
            name="content"
            value={pageState.filter.content || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Media"
            variant="outlined"
            name="media"
            value={pageState.filter.media || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Author"
            variant="outlined"
            name="author.username"
            value={pageState.filter["author.username"] || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Creation Date"
            variant="outlined"
            name="createdAt"
            value={pageState.filter.createdAt || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Likes"
            variant="outlined"
            name="likes"
            value={pageState.filter.likes || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Comments"
            variant="outlined"
            name="comments"
            value={pageState.filter.comments || ""}
            onChange={handleFilterChange}
          />
        </Box>
        {pageState.isLoading ? (
          <CircularProgress />
        ) : (
          <PaginatedTable
            pageState={pageState}
            columns={columns}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default PostsAdminPage;
