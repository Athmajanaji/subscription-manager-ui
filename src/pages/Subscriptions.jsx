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
  TextField,
  Pagination,
  TableSortLabel
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { getSubscriptions } from '../services/subscriptionService';
import ProtectedRoute from '../components/ProtectedRoute';
import AddSubscriptionDialog from '../pages/AddSubscriptionDialog';
import DeleteSubscriptionDialog from '../components/DeleteSubscriptionDialog';


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
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const searchDebounceRef = React.useRef();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  // derive the string used by backend
  const sort = `${sortField},${sortDirection}`;
  const [editingSub, setEditingSub] = useState(null);


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSubscriptions(page, size, sort, search);
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
  }, [page, size, sortField, sortDirection]);

  // watch search term and refetch
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // debounce searchInput -> search
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      const trimmed = (searchInput || '').trim();
      setSearch(trimmed);
      setPage(0);
    }, 450);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const handleSort = (field) => {
    if (sortField === field) {
      // same column clicked — toggle direction
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      // new column — default to asc
      setSortField(field);
      setSortDirection('asc');
    }
    // when sorting changes, go back to first page
    setPage(0);
  };

  const [openAdd, setOpenAdd] = useState(false);

  const refreshAfterCreate = () => {
    setPage(0);
    fetchData();
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Subscriptions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all your subscriptions here.
          </Typography>
        </div>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* server-side search box */}
          <TextField
            size="small"
            placeholder="Search subscriptions"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ minWidth: 260 }}
          />
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

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingSub(null);
              setOpenAdd(true);
            }}
          >
            Add subscription
          </Button>

        </Box>
      </Box>

      <Paper elevation={1}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortDirection : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>

                <TableCell>Category</TableCell>

                <TableCell>
                  <TableSortLabel
                    active={sortField === 'amount'}
                    direction={sortField === 'amount' ? sortDirection : 'asc'}
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>

                <TableCell>Billing</TableCell>

                <TableCell>
                  <TableSortLabel
                    active={sortField === 'nextBillingDate'}
                    direction={sortField === 'nextBillingDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('nextBillingDate')}
                  >
                    Next Billing
                  </TableSortLabel>
                </TableCell>

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
                  <TableRow
                    key={s.id}
                    sx={{
                      transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, background-color 220ms ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 18px rgba(2,6,23,0.12)',
                        backgroundColor: (theme) => theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)'
                      }
                    }}
                  >
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
                      <Button
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => {
                          setEditingSub(s);
                          setOpenAdd(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedSub(s);
                          setOpenDelete(true);
                        }}
                      >
                        Delete
                      </Button>

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
      <AddSubscriptionDialog
        open={openAdd}
        subscription={editingSub}
        onClose={() => {
          setOpenAdd(false);
          setEditingSub(null);
        }}
        onSuccess={refreshAfterCreate}
      />

      <DeleteSubscriptionDialog
        open={openDelete}
        subscription={selectedSub}
        onClose={() => setOpenDelete(false)}
        onDeleted={() => {
          setPage(0);
          fetchData();
        }}
      />


    </Container>
  );
}
