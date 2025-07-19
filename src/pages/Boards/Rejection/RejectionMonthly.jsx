import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { LineChart, Line } from 'recharts';

const BACKEND_API = import.meta.env.VITE_BACKEND_API;
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const RejectionMonthly = () => {
  const { token } = useSelector((state) => state.auth);
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [tableData, setTableData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch table data when year or month changes
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_API}/get_rejection_details_by_part_description?year=${year}&month=${month}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch rejection data');
        const result = await response.json();
        setTableData(result.rm_wise_summary || []);

        // Prepare graph data
        const graphData = result.rm_wise_summary.map((item) => ({
          name: item.rm,
          'OK Parts': item.total_ok_parts,
          Rejection: item.total_rejection,
          Lumps: item.total_lumps,
          Runner: item.total_runner,
          'Scrap (R+L)': item.total_scrap_sum_Rej_Lump,
          'Scrap (R+L+Rn)': item.total_scrap_Rej_Lump_Runner,
          Different: item.different,
        }));

        // Add total row to graph data
        if (result.rm_wise_summary.length > 0) {
          const totals = result.rm_wise_summary.reduce(
            (acc, item) => ({
              'OK Parts': acc['OK Parts'] + (item.total_ok_parts || 0),
              Rejection: acc['Rejection'] + (item.total_rejection || 0),
              Lumps: acc['Lumps'] + (item.total_lumps || 0),
              Runner: acc['Runner'] + (item.total_runner || 0),
              'Scrap (R+L)': acc['Scrap (R+L)'] + (item.total_scrap_sum_Rej_Lump || 0),
              'Scrap (R+L+Rn)': acc['Scrap (R+L+Rn)'] + (item.total_scrap_Rej_Lump_Runner || 0),
              Different: acc['Different'] + (item.different || 0),
            }),
            {
              'OK Parts': 0,
              Rejection: 0,
              Lumps: 0,
              Runner: 0,
              'Scrap (R+L)': 0,
              'Scrap (R+L+Rn)': 0,
              Different: 0,
            }
          );

          graphData.push({
            name: 'TOTAL',
            ...totals,
          });
        }

        setGraphData(graphData);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
        setTableData([]);
        setGraphData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [year, month, token]);

  // Calculate totals for summary row
  const calculateTotals = () => {
    return tableData.reduce(
      (acc, row) => {
        acc.total_ok_parts += row.total_ok_parts || 0;
        acc.total_rejection += row.total_rejection || 0;
        acc.total_lumps += row.total_lumps || 0;
        acc.total_runner += row.total_runner || 0;
        acc.total_issued += row.total_issued || 0;
        acc.total_scrap_sum_Rej_Lump += row.total_scrap_sum_Rej_Lump || 0;
        acc.total_scrap_Rej_Lump_Runner += row.total_scrap_Rej_Lump_Runner || 0;
        acc.different += row.different || 0;
        return acc;
      },
      {
        total_ok_parts: 0,
        total_rejection: 0,
        total_lumps: 0,
        total_runner: 0,
        total_issued: 0,
        total_scrap_sum_Rej_Lump: 0,
        total_scrap_Rej_Lump_Runner: 0,
        different: 0,
      }
    );
  };

  const totals = tableData.length > 0 ? calculateTotals() : null;
  const currentMonthName = monthNames[month - 1];

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: <strong>{entry.value.toFixed(1)}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend formatter
  const formatLegend = (value) => {
    if (value === 'OK Parts') return 'OK Parts';
    if (value === 'Rejection') return 'Rejection';
    if (value === 'Lumps') return 'Lumps';
    if (value === 'Runner') return 'Runner';
    if (value === 'Scrap (R+L)') return 'Scrap (R+L)';
    if (value === 'Scrap (R+L+Rn)') return 'Scrap (R+L+Rn)';
    return value;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom align="center">
        Monthly Rejection Details
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ width: 120 }}
          inputProps={{ min: 2000, max: 2100 }}
        />
        <TextField
          select
          label="Month"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          sx={{ width: 120 }}
          SelectProps={{ native: true }}
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </TextField>
      </Box>

      {/* Rejection Data Table */}
      <Paper sx={{ mb: 4, overflowX: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Raw Material</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                OK Parts
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Rejection
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Lumps
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Runner
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Issued
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Scrap (R+L)
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                % (R+L)
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Scrap (R+L+Rn)
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">
                Difference
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography>Loading rejection data...</Typography>
                </TableCell>
              </TableRow>
            ) : tableData.length > 0 ? (
              <>
                {tableData.map((row, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.rm}</TableCell>
                    <TableCell align="right">{row.total_ok_parts?.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.total_rejection?.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.total_lumps?.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.total_runner?.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.total_issued?.toFixed(1)}</TableCell>
                    <TableCell align="right">{row.total_scrap_sum_Rej_Lump?.toFixed(1)}</TableCell>
                    <TableCell align="right">
                      {row.total_issued
                        ? ((row.total_scrap_sum_Rej_Lump / row.total_issued) * 100).toFixed(1) + '%'
                        : '0%'}
                    </TableCell>
                    <TableCell align="right">
                      {row.total_scrap_Rej_Lump_Runner?.toFixed(1)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          row.different < 0
                            ? 'error.main'
                            : row.different > 0
                            ? 'success.main'
                            : 'inherit',
                        fontWeight: 'bold',
                      }}
                    >
                      {row.different?.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Summary Row */}
                <TableRow sx={{ bgcolor: '#f5f5f5', '& td': { fontWeight: 'bold' } }}>
                  <TableCell>TOTAL</TableCell>
                  <TableCell align="right">{totals.total_ok_parts.toFixed(1)}</TableCell>
                  <TableCell align="right">{totals.total_rejection.toFixed(1)}</TableCell>
                  <TableCell align="right">{totals.total_lumps.toFixed(1)}</TableCell>
                  <TableCell align="right">{totals.total_runner.toFixed(1)}</TableCell>
                  <TableCell align="right">{totals.total_issued.toFixed(1)}</TableCell>
                  <TableCell align="right">{totals.total_scrap_sum_Rej_Lump.toFixed(1)}</TableCell>
                  <TableCell align="right">
                    {totals.total_issued
                      ? ((totals.total_scrap_sum_Rej_Lump / totals.total_issued) * 100).toFixed(1) +
                        '%'
                      : '0%'}
                  </TableCell>
                  <TableCell align="right">
                    {totals.total_scrap_Rej_Lump_Runner.toFixed(1)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        totals.different < 0
                          ? 'error.main'
                          : totals.different > 0
                          ? 'success.main'
                          : 'inherit',
                      fontWeight: 'bold',
                    }}
                  >
                    {totals.different.toFixed(1)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1">
                    No rejection data available for {currentMonthName} {year}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Bar Chart Visualization */}
      <Typography variant="h5" gutterBottom align="center">
        Rejection Metrics for {currentMonthName} {year}
      </Typography>
      <Paper sx={{ p: 2, height: 500, mb: 4 }}>
        {loading ? (
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress size={60} />
            <Typography mt={2}>Loading chart data...</Typography>
          </Box>
        ) : graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={graphData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => value.toFixed(0)} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={formatLegend} wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="OK Parts" fill="#4caf50" name="OK Parts" />
              <Bar dataKey="Rejection" fill="#f44336" name="Rejection" />
              <Bar dataKey="Lumps" fill="#ff9800" name="Lumps" />
              <Bar dataKey="Runner" fill="#2196f3" name="Runner" />
              <Bar dataKey="Scrap (R+L)" fill="#9c27b0" name="Scrap (R+L)" />
              <Bar dataKey="Scrap (R+L+Rn)" fill="#673ab7" name="Scrap (R+L+Rn)" />
              <Bar dataKey="Different" fill="#e91e63" name="Different" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box height="100%" display="flex" alignItems="center" justifyContent="center">
            <Typography>
              No chart data available for {currentMonthName} {year}
            </Typography>
          </Box>
        )}
      </Paper>
      {/* <Paper sx={{ p: 2, height: 500, mb: 4 }}>
        {loading ? (
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress size={60} />
            <Typography mt={2}>Loading chart data...</Typography>
          </Box>
        ) : graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graphData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => value.toFixed(0)} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={formatLegend} wrapperStyle={{ paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="OK Parts"
                stroke="#4caf50"
                strokeWidth={2}
                dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
                name="OK Parts"
              />
              <Line
                type="monotone"
                dataKey="Rejection"
                stroke="#f44336"
                strokeWidth={2}
                dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
                name="Rejection"
              />
              <Line
                type="monotone"
                dataKey="Lumps"
                stroke="#ff9800"
                strokeWidth={2}
                dot={{ fill: '#ff9800', strokeWidth: 2, r: 4 }}
                name="Lumps"
              />
              <Line
                type="monotone"
                dataKey="Runner"
                stroke="#2196f3"
                strokeWidth={2}
                dot={{ fill: '#2196f3', strokeWidth: 2, r: 4 }}
                name="Runner"
              />
              <Line
                type="monotone"
                dataKey="Scrap (R+L)"
                stroke="#9c27b0"
                strokeWidth={2}
                dot={{ fill: '#9c27b0', strokeWidth: 2, r: 4 }}
                name="Scrap (R+L)"
              />
              <Line
                type="monotone"
                dataKey="Scrap (R+L+Rn)"
                stroke="#673ab7"
                strokeWidth={2}
                dot={{ fill: '#673ab7', strokeWidth: 2, r: 4 }}
                name="Scrap (R+L+Rn)"
              />
              <Line
                type="monotone"
                dataKey="Different"
                stroke="#e91e63"
                strokeWidth={2}
                dot={{ fill: '#e91e63', strokeWidth: 2, r: 4 }}
                name="Different"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Box height="100%" display="flex" alignItems="center" justifyContent="center">
            <Typography>
              No chart data available for {currentMonthName} {year}
            </Typography>
          </Box>
        )}
      </Paper> */}
    </Box>
  );
};

export default RejectionMonthly;
