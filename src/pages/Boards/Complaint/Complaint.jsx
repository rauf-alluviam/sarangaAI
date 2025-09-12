import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import colors from '../../../utils/colors';
import { useDispatch, useSelector } from 'react-redux';
import { MdDone } from 'react-icons/md';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import AddComplaint from './AddComplaint';
import { fetchComplaints, updateComplaint } from '../../../Redux/Actions/complaintAction';
import { enqueueSnackbar } from 'notistack';
import { IoPersonSharp } from 'react-icons/io5';

const Complaint = () => {
  const { userData, token } = useSelector((state) => state.auth);
  const { complaints, complaintsLoading } = useSelector((state) => state.complaint);

  const dispatch = useDispatch();

  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.ceil((new Date().getMonth() + 1) / 3)
  );

  // Quarter options
  const quarterOptions = [
    { value: 1, label: 'Q1 (Jan-Mar)' },
    { value: 2, label: 'Q2 (Apr-Jun)' },
    { value: 3, label: 'Q3 (Jul-Sep)' },
    { value: 4, label: 'Q4 (Oct-Dec)' },
  ];

  // Year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year, label: year.toString() };
  });

  // Fetch complaints when year or quarter changes
  useEffect(() => {
    if (selectedYear && selectedQuarter) {
      dispatch(fetchComplaints(selectedYear, selectedQuarter, token));
    }
  }, [selectedYear, selectedQuarter, dispatch, token, isOpen]);

  // Handle complaint update
  const handleUpdate = () => {
    dispatch(
      updateComplaint(
        edit.id,
        edit,
        (successMsg) => {
          setEdit({});
          enqueueSnackbar(successMsg, { variant: 'success' });
        },
        (errorMsg) => {
          enqueueSnackbar(errorMsg, { variant: 'error' });
        }
      )
    );
  };

  // Render editable field
  const renderEditableField = (elem, fieldName, type = 'text', options = null) => {
    if (edit.id === elem.id) {
      if (type === 'select') {
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{fieldName}</InputLabel>
            <Select
              value={edit[fieldName] || ''}
              onChange={(e) => setEdit({ ...edit, [fieldName]: e.target.value })}
              label={fieldName}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }

      return (
        <TextField
          fullWidth
          type={type}
          value={edit[fieldName] || ''}
          onChange={(e) =>
            setEdit({
              ...edit,
              [fieldName]: type === 'number' ? Number(e.target.value) : e.target.value,
            })
          }
          size="small"
          InputLabelProps={type === 'date' ? { shrink: true } : undefined}
        />
      );
    }

    // Display mode
    if (fieldName === 'status') {
      return (
        <Box>
          {elem.status === 'yes' && (
            <Box m={'auto'} bgcolor={'green'} width={'22px'} height={'22px'} borderRadius={'50%'} />
          )}
          {elem.status === 'no' && (
            <Box m={'auto'} bgcolor={'red'} width={'22px'} height={'22px'} borderRadius={'50%'} />
          )}
        </Box>
      );
    }

    return elem[fieldName] || '-';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '88vh',
        width: 'auto',
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          fontSize: '2rem',
          textAlign: 'center',
          width: '100%',
          mr: 'auto',
          padding: '1rem 0rem',
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          mb: '1rem',
        }}
      >
        CUSTOMER COMPLAINT MEETING BOARD
      </Typography>

      {/* Control Panel */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: '1rem',
          padding: '0.5rem',
        }}
      >
        {/* Responsible Person Section */}
        <Box
          ml="1rem"
          display="flex"
          alignItems="center"
          sx={{
            bgcolor: '#FAFAFA',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            boxShadow: '0px 3px 8px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            flexWrap: 'wrap',
          }}
        >
          <Box display="flex" width="12rem" alignItems="center" sx={{ mr: '1rem' }}>
            <IoPersonSharp
              style={{
                color: '#282828',
                fontSize: '1.5rem',
                marginRight: '0.5rem',
              }}
            />
            <Typography fontWeight={500}>Responsible Person-</Typography>
          </Box>

          {complaints.length > 0 ? (
            edit.id === complaints[0].id ? (
              <>
                <TextField
                  type="text"
                  defaultValue={complaints[0]?.responsibility || ''}
                  onChange={(e) => setEdit({ ...edit, responsibility: e.target.value })}
                  sx={{ width: '7rem' }}
                  size="small"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', ml: '1rem' }}>
                  <IconButton onClick={() => setEdit({})}>
                    <CloseIcon sx={{ color: '#CC7C7C' }} />
                  </IconButton>
                  <IconButton onClick={handleUpdate}>
                    <MdDone style={{ color: 'green' }} />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  backgroundColor: '#FFCDD2',
                  height: '2rem',
                  borderRadius: '4px',
                  padding: '0 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ml: '0.5rem',
                  color: '#282828',
                  boxShadow: 'rgba(0, 0, 0, 0.17) 0px 3px 8px',
                }}
              >
                {complaints[0]?.responsibility || 'Not mentioned'}
              </Box>
            )
          ) : (
            <Typography
              sx={{
                marginLeft: '1rem',
                color: '#888',
                fontStyle: 'italic',
              }}
            >
              No data available
            </Typography>
          )}

          {complaints.length > 0 && edit.id !== complaints[0]?.id && (
            <IconButton
              onClick={() => setEdit(complaints[0])}
              sx={{ color: 'rgb(201, 162, 56)', ml: '1rem' }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        {/* Right Side Controls */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            sx={{ bgcolor: colors.primary, width: '10rem' }}
            variant="contained"
            onClick={() => setIsOpen(true)}
          >
            Add New Item
          </Button>

          {/* Year Selector */}
          <FormControl sx={{ width: '8rem' }} size="small">
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              label="Year"
            >
              {yearOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Quarter Selector */}
          <FormControl sx={{ width: '10rem' }} size="small">
            <InputLabel>Quarter</InputLabel>
            <Select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              label="Quarter"
            >
              {quarterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Add Complaint Modal */}
      {isOpen && (
        <Box
          bgcolor={'rgba(0, 0, 0, 0.6)'}
          position={'fixed'}
          top={0}
          left={0}
          height={'100vh'}
          width={'100vw'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          zIndex={9}
          onClick={() => setIsOpen(false)}
        >
          <AddComplaint setIsOpen={setIsOpen} />
        </Box>
      )}

      {/* Main Table */}
      <Box
        position="relative"
        mr="1rem"
        p="0.7rem"
        borderRadius="6px"
        display="flex"
        flexDirection="column"
        alignItems="start"
        sx={{
          minHeight: '75vh',
          width: '100%',
          overflow: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#555',
          },
        }}
      >
        <Paper sx={{ width: '100%', height: '70vh' }}>
          <TableContainer
            sx={{
              maxHeight: '70vh',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            <Table stickyHeader aria-label="sticky table" border={1}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                  <TableCell sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Sr No
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Customer
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Part Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Complaint
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Complaint Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Part Received Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Problem Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Quantity
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Line Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Tracability
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    First/ Repeat
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Supplier/ Inhouse
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Process
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Temporary Action
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Target Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Root Cause
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Permanent Action
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Target Date
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Responsibility
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Standardization
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Horizontal Deployment (Y/N)
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '1.2rem', backgroundColor: 'inherit' }}>
                    Edit
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {complaintsLoading ? (
                  <TableRow>
                    <TableCell colSpan={23} align="center">
                      <Typography>Loading complaints...</Typography>
                    </TableCell>
                  </TableRow>
                ) : complaints.length > 0 ? (
                  complaints.map((elem, index) => (
                    <TableRow
                      key={elem.id || index}
                      hover
                      sx={{
                        bgcolor: elem.id === edit.id && 'rgb(188, 196, 209)',
                        transition: '0.4s',
                      }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'customer')}</TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'part_name')}</TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'complaint')}</TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'complaint_date', 'date')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'part_received_date', 'date')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'problem_description')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'quantity', 'number')}
                      </TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'line_name')}</TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'tracebility', 'date')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'first_repeat')}
                      </TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'supplier')}</TableCell>
                      <TableCell align="center">{renderEditableField(elem, 'process')}</TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'temporary_action')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'temporary_target_date', 'date')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'root_cause')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'permanent_action')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'permanent_target_date', 'date')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'responsibility')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'status', 'select', [
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                        ])}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'standerdization')}
                      </TableCell>
                      <TableCell align="center">
                        {renderEditableField(elem, 'horizental_deployment', 'select', [
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                        ])}
                      </TableCell>
                      <TableCell align="center">
                        {edit.id === elem.id ? (
                          <Box display="flex" justifyContent="center">
                            <IconButton onClick={() => setEdit({})}>
                              <CloseIcon style={{ color: '#CC7C7C' }} />
                            </IconButton>
                            <IconButton onClick={handleUpdate}>
                              <MdDone style={{ color: 'green' }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <IconButton onClick={() => setEdit(elem)}>
                            <EditIcon style={{ color: 'rgb(201, 162, 56)' }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={23} align="center">
                      <Typography>
                        No complaints available for Q{selectedQuarter} {selectedYear}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Complaint;
