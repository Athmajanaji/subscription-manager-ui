// src/pages/Subscriptions.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getSubscriptions } from '../services/subscriptionService';
import ProtectedRoute from '../components/ProtectedRoute';

function formatAmount(amount, currency) {
  return `${amount} ${currency}`;
}

export default function Subscriptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10
  });

  const [page, setPage] = useState(0); // 0-based for backend
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('id,asc');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubscriptions(page, size, sort);
      setPageData(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, sort]);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all your subscriptions here.
          </Typography>
        </div>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-label">Sort</InputLabel>
            <Select
              labelId="sort-label"
              value={sort}
              label="Sort"
              onChange={(e) => { setSort(e.target.value); setPage(0); }}
            >
              <MenuItem value="id,asc">Newest</MenuItem>
              <MenuItem value="amount,desc">Amount (high → low)</MenuItem>
              <MenuItem value="nextBillingDate,asc">Next billing (soonest)</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="size-label">Per page</InputLabel>
            <Select
              labelId="size-label"
              value={size}
              label="Per page"
              onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<AddIcon />}>Add subscription</Button>
        </Box>
      </Box>

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Billing</TableCell>
                <TableCell>Next Billing</TableCell>
                <TableCell>Auto renew</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="error">{error}</Typography>
                  </TableCell>
                </TableRow>
              ) : pageData.content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="text.secondary">No subscriptions found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pageData.content.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={s.category} size="small" />
                    </TableCell>

                    <TableCell>{formatAmount(s.amount, s.currency)}</TableCell>

                    <TableCell>{s.billingPeriod}</TableCell>

                    <TableCell>{s.nextBillingDate}</TableCell>

                    <TableCell>{s.autoRenew ? 'Yes' : 'No'}</TableCell>

                    <TableCell>{s.paymentMethod}</TableCell>

                    <TableCell align="right">
                      <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                      <Button size="small" color="error">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={pageData.totalPages || 1}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          color="primary"
        />
      </Box>
    </Container>
  );
}
