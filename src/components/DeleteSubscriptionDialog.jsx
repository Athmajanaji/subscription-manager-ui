import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { deleteSubscription } from '../services/subscriptionService';

export default function DeleteSubscriptionDialog({
  open,
  onClose,
  subscription,
  onDeleted
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteSubscription(subscription.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to delete subscription'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete subscription</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography>
          Are you sure you want to delete{' '}
          <strong>{subscription.name}</strong>?
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
