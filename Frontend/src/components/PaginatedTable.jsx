import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Avatar,
} from "@mui/material";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaginatedTable = ({
  pageState,
  columns,
  onPageChange,
  onPageSizeChange,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Filtered Data", 20, 10);
    doc.autoTable({
      head: [columns.map((col) => col.headerName)],
      body: pageState.data.map((row) => columns.map((col) => row[col.field])),
      startY: 20,
    });
    doc.save("filtered_data.pdf");
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const getDisplayValue = (row, column) => {
    const value = getNestedValue(row, column.field);

    if (
      column.field === "followers" ||
      column.field === "following" ||
      column.field === "likes" ||
      column.field === "comments" ||
      column.field === "posts"
    ) {
      return Array.isArray(value) ? value.length : 0;
    } else if (column.field === "createdAt") {
      return new Date(value).toLocaleDateString();
    } else if (column.field === "isActive") {
      return value ? "Activo" : "Inactivo";
    } else if (
      column.field === "user.username" ||
      column.field === "author.username"
    ) {
      const user = row.user || row.author;
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={user.profilePicture || ""}
            alt={user.username}
            style={{ marginRight: 8 }}
          />
          {user.username}
        </div>
      );
    } else if (column.field === "media") {
      return value.length > 0 ? (
        <img src={value[0]} alt="media" style={{ width: "100px" }} />
      ) : (
        "No media"
      );
    } else {
      return value;
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="secondary"
        onClick={generatePDF}
        sx={{ mb: 2 }}
      >
        Descargar PDF
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={`${column.field}-header`}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageState.data.map((row) => (
              <TableRow key={row._id}>
                {columns.map((column) => (
                  <TableCell key={`${row._id}-${column.field}`}>
                    {column.field === "actions" ? (
                      <div>
                        {column.showEdit && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => column.handleEdit(row)}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => column.handleDelete(row)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ) : (
                      getDisplayValue(row, column)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pageState.total}
          page={pageState.page}
          onPageChange={onPageChange}
          rowsPerPage={pageState.pageSize}
          onRowsPerPageChange={onPageSizeChange}
        />
      </TableContainer>
    </Box>
  );
};

PaginatedTable.propTypes = {
  pageState: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default PaginatedTable;
