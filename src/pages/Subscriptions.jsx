// src/pages/Subscriptions.jsx
import React from 'react';
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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

// sample/mock data
const MOCK = [
  {
    id: 1,
    name: 'Netflix',
    category: 'STREAMING',
    amount: 499,
    currency: 'INR',
    billingPeriod: 'MONTHLY',
    nextBillingDate: '2025-12-20',
    autoRenew: true,
    paymentMethod: 'CREDIT_CARD'
  },
  {
    id: 2,
    name: 'Spotify',
    category: 'STREAMING',
    amount: 119,
    currency: 'INR',
    billingPeriod: 'MONTHLY',
    nextBillingDate: '2025-12-25',
    autoRenew: true,
    paymentMethod: 'UPI'
  },
  {
    id: 3,
    name: 'Dropbox',
    category: 'CLOUD',
    amount: 1200,
    currency: 'INR',
    billingPeriod: 'YEARLY',
    nextBillingDate: '2026-01-10',
    autoRenew: false,
    paymentMethod: 'CREDIT_CARD'
  }
];

function formatAmount(amount, currency) {
  return `${amount} ${currency}`;
}

export default function Subscriptions() {
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

        <Button variant="contained" startIcon={<AddIcon />}>
          Add subscription
        </Button>
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
              {MOCK.map((s) => (
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
                    <Button size="small" sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" color="error">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
