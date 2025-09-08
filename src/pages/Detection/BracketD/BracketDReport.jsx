import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;

const BracketDReport = ({ addedItem, totalCrateCount }) => {
  const { token } = useSelector((state) => state.auth);
  const [isShowImg, setIsShowImg] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const [reports, setReports] = useState([]);
  console.log(reports);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BACKEND_API}/bracketD-images-data-classification`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setReports(response.data.images);
        totalCrateCount(response.data.images);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [addedItem]);
  return (
    <Box position={'relative'}>
      {/* --------image modal------------- */}
      {isShowImg && (
        <Box
          onClick={() => {
            setIsShowImg(false);
          }}
          bgcolor={'rgba(24, 24, 24, 0.77)'}
          sx={{ overflowY: 'auto', padding: '1rem' }}
          position={'fixed'}
          height={'100vh'}
          width={'100%'}
          zIndex={'77'}
          top={0}
          left={'0'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <img
            src={selectedImg}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '50%',
              marginTop: '1rem',
              cursor: 'pointer',
              boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            }}
            alt=""
          />
          {/* <Button sx={{position: 'absolute', top: '1rem', right: '1rem'}} onClick={()=> setIsShowImg(false)}>Delete</Button> */}
        </Box>
      )}

      <Typography
        fontSize={'1.4rem'}
        borderBottom={'1px solid black'}
        width={'5rem'}
        m={'2rem 1rem'}
      >
        Report:-
      </Typography>

      <Paper>
        <TableContainer>
          <Table aria-label="simple table" border={1}>
            <TableHead sx={{ bgcolor: 'grey', border: '1px solid black' }}>
              <TableRow
                sx={{ bgcolor: 'rgb(164, 182, 211)', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
              >
                <TableCell sx={{ fontSize: '1.2rem', maxWidth: '6rem', width: '6rem' }}>
                  Sr No
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '1.2rem' }}>
                  Date
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '1.2rem' }}>
                  Time
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '1.2rem' }}>
                  Original Image
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '1.2rem' }}>
                  Process Image
                </TableCell>
                {/* <TableCell align="center" sx={{fontSize: '1.2rem'}}>Count</TableCell> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* {isLoading && (
                  <TableRow>
                    <TableCell colSpan={12} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                )} */}
              {reports.length > 0 &&
                reports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" align="center">
                      {index + 1}
                    </TableCell>
                    {/* <TableCell align="center">{report.file_id.split('_')[0]}</TableCell>
                            <TableCell align="center">{report.file_id.split('_')[1]}</TableCell> */}
                    <TableCell align="center">
                      {report.timestamp.split(' ')[0].split('-').reverse().join('-')}
                    </TableCell>

                    <TableCell align="center">
                      {report.timestamp.split(' ')[1]} {report.timestamp.split(' ')[2]}
                    </TableCell>

                    <TableCell align="center">
                      {new Date(
                        report.file_id.slice(0, 8).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3') +
                          'T' +
                          report.file_id.slice(9, 15).replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3')
                      ).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell align="center">
                      <img
                        src={report.original_url}
                        onClick={() => {
                          setSelectedImg(report.original_url), setIsShowImg(true);
                        }}
                        alt={`Original ${index}`}
                        style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <img
                        src={report.processed_url}
                        onClick={() => {
                          setSelectedImg(report.processed_url), setIsShowImg(true);
                        }}
                        alt={`Processed ${index}`}
                        style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BracketDReport;
