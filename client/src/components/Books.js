import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = async () => {
    try {
      const response = await fetch('/addbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // name: '',
          // author: '',
          // purchasedate: '',
          // accessionnumber: 0,
          isNew:'true'
        }),
      });
  
      if (response.ok) {
        try {
          const newBook = await response.json();
  
          // Ensure the response contains the expected properties
          if (newBook && newBook._id) {
            // Only add the new row to the state after a successful response
            setRows((oldRows) => [...oldRows, { ...newBook, id: newBook._id }]);
            setRowModesModel((oldModel) => ({
           
              [newBook._id]: { mode: 'edit', fieldToFocus: 'name' },
            }));
          } else {
            console.error('Invalid response format:', newBook);
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
        }
      } else {
        console.error('Failed to add a new book:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding a new book:', error);
    }
  };
  
  

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
  };

  const handleSaveClick = (id) => async () => {
    try {
      const isNewBook = rowModesModel[id]?.isNew;
  
      console.log('isNewBook:', isNewBook);
      console.log('rowModesModel[id]:', rowModesModel[id]);
  
      const requestBody = {
        ...rowModesModel[id],
        isNew: isNewBook, // Keep isNew property consistent
      };
  
      console.log('Request Body:', requestBody);
  
      const response = isNewBook
        ? await fetch('/addbook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })
        : await fetch(`/updatebook/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
  
      console.log('Response:', response);
  
      if (response.ok) {
        const updatedData = await response.json();
  
        console.log('Updated Data:', updatedData);
  
        if (isNewBook) {
          console.log('Book saved successfully:', updatedData);
        } else {
          console.log('Book updated successfully:', updatedData);
        }
  
        // Update the rows with the new data
        setRows((oldRows) =>
          oldRows.map((row) => (row.id === updatedData.id ? updatedData : row))
        );
  
        setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
      } else {
        console.error('Failed to save/update book:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving/updating book:', error);
    }
  };
  
  const handleDeleteClick = (id) => async () => {
    const confirmed = window.confirm('Are you sure you want to delete this book?');
  
    if (confirmed) {
      try {
        const deleteResponse = await fetch(`/deletebook/${id}`, {
          method: 'DELETE',
        });
  
        if (deleteResponse.ok) {
          setRows(rows.filter((row) => row.id !== id));
          console.log('Book deleted successfully');
        } else {
          console.error('Failed to delete book:', deleteResponse.statusText);
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };
  
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: 'view', ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    try {
      const updatedRow = { ...newRow, isNew: false, id: newRow._id }; // Map _id to id
      setRows((rows) =>
        rows.map((row) => (row.id === newRow._id ? updatedRow : row))
      );
  
      // Use addbook route for saving new books and updatebook route for updating existing books
      if (newRow.isNew) {
        const response = await fetch('/addbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRow),
        });
  
        if (response.ok) {
          const savedBook = await response.json();
          console.log('Book saved successfully:', savedBook);
        } else {
          console.error('Failed to save book:', response.statusText);
        }
      } else {
        const response = await fetch(`/updatebook/${newRow.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRow),
        });
  
        if (response.ok) {
          const updatedData = await response.json();
          console.log('Book updated successfully:', updatedData);
        } else {
          console.error('Failed to update book:', response.statusText);
        }
      }
  
      return updatedRow;
    } catch (error) {
      console.error('Error processing row update:', error);
      return newRow; // Return the original row in case of an error
    }
  };
  
  

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/showbooks');
        const data = await response.json();

        const rowsWithId = data.map((row) => ({
          ...row,
          id: row._id,
          bname: row.name,
          author: row.author,
          buydate: row.purchasedate,
        }));

        setRows(rowsWithId);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const columns = [
    { field: 'accessionnumber', headerName: 'Accession number', width: 180, editable: true },
    { field: 'name', headerName: 'Book Name', width: 240, editable: true },
    { field: 'author', headerName: 'Author', type: 'Text', width: 300, align: 'left', headerAlign: 'left', editable: true },
    // { field: 'publisher', headerName: 'Publisher', type: 'Text', width: 250, editable: true },
    {
      field: 'purchasedate',
      headerName: 'Buying date',
      type: "date",
      width: 180,
      editable: true,
      valueGetter: (params) => new Date(params.row.buydate),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}
