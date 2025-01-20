import { DataGrid } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getTransactionByUser } from "../../../services/transactionRequest";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import { styled } from "@mui/system";

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await getTransactionByUser(currentUser._id);
      setTransactions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [currentUser._id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& .MuiDataGrid-root": { border: "none" },
    "& .MuiDataGrid-cell": {
      color: theme.palette.text.secondary,
      fontSize: "16px",
    },
    "& .MuiDataGrid-columnsContainer": {
      backgroundColor: theme.palette.background.default,
    },
    "& .MuiDataGrid-columnHeaders": {
      borderBottom: `2px solid ${theme.palette.divider}`,
      fontSize: "18px",
      fontWeight: "bold",
      color: theme.palette.text.primary,
    },
    "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
    "& .MuiDataGrid-row": { backgroundColor: theme.palette.background.paper },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
    "& .MuiDataGrid-row:hover": { backgroundColor: theme.palette.action.focus },
    "@media (max-width: 600px)": {
      "& .MuiDataGrid-columnHeaders": {
        display: "none",
      },
      "& .MuiDataGrid-cell": {
        flex: 1,
        minWidth: "100px",
      },
    },
  }));

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "transactionId", headerName: "Transaction ID", width: 200 },
    { field: "currency", headerName: "Currency", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "paymentMethod", headerName: "Payment Method", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    { field: "updatedAt", headerName: "Updated At", width: 200 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
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
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: (theme) => theme.palette.text.primary,
            mb: 2,
          }}
        >
          My transactions history
        </Typography>

        {/* DataGrid */}
        {transactions.length > 0 && (
          <StyledDataGrid
            rows={transactions}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        )}
        {transactions.length === 0 && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: (theme) => theme.palette.text.primary,
              mb: 2,
            }}
          >
            No transactions found
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/feed")}
        >
          Back to feed
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionsPage;
