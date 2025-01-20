import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, TextField } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import PaginatedTable from "../../../components/PaginatedTable";
import { useTheme } from "../../../context/ThemeContext";
import { getFilteredTransactions } from "../../../services/transactionRequest";

const TransactionsAdminPage = () => {
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 0,
    pageSize: 10,
    filter: {},
  });
  const theme = useTheme();

  const handleEdit = (row) => {
    console.log("Edit row:", row);
    // Lógica para editar el usuario
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
    // Lógica para eliminar el usuario
  };

  const columns = [
    { field: "user.username", headerName: "User" },
    { field: "amount", headerName: "Amount" },
    { field: "currency", headerName: "Currency" },
    { field: "paymentMethod", headerName: "Payment Method" },
    { field: "createdAt", headerName: "Date" },
    { field: "status", headerName: "Status" },
    { field: "transactionId", headerName: "Transaction ID" },
    {
      field: "actions",
      headerName: "Actions",
      handleEdit: handleEdit,
      handleDelete: handleDelete,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      setPageState((old) => ({ ...old, isLoading: true }));
      try {
        const response = await getFilteredTransactions({
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
        background:
          theme === "dark"
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
          Transactions Admin
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <TextField
            label="User"
            variant="outlined"
            name="user.username"
            value={pageState.filter["user.username"] || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Amount"
            variant="outlined"
            name="amount"
            value={pageState.filter.amount || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Currency"
            variant="outlined"
            name="currency"
            value={pageState.filter.currency || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Payment Method"
            variant="outlined"
            name="paymentMethod"
            value={pageState.filter.paymentMethod || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Date"
            variant="outlined"
            name="createdAt"
            value={pageState.filter.createdAt || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Status"
            variant="outlined"
            name="status"
            value={pageState.filter.status || ""}
            onChange={handleFilterChange}
          />
          <TextField
            label="Transaction ID"
            variant="outlined"
            name="transactionId"
            value={pageState.filter.transactionId || ""}
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

export default TransactionsAdminPage;
