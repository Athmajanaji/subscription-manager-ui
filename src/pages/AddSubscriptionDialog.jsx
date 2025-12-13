import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Alert,
    Snackbar
} from '@mui/material';
import { createSubscription, updateSubscription } from '../services/subscriptionService';

const CATEGORIES = ['STREAMING', 'CLOUD', 'SOFTWARE', 'UTILITIES', 'OTHER'];
const BILLING_PERIODS = ['MONTHLY', 'YEARLY'];
const PAYMENT_METHODS = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING'];

export default function AddSubscriptionDialog({ open, onClose, onSuccess, subscription }) {
    const initialForm = {
        name: '',
        category: 'STREAMING',
        amount: '',
        currency: 'INR',
        billingPeriod: 'MONTHLY',
        nextBillingDate: '',
        autoRenew: true,
        paymentMethod: 'UPI',
        notes: ''
    };

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setError(null);
            if (subscription) {
                setForm({
                    name: subscription.name || '',
                    category: subscription.category || 'STREAMING',
                    amount: subscription.amount != null ? String(subscription.amount) : '',
                    currency: subscription.currency || 'INR',
                    billingPeriod: subscription.billingPeriod || 'MONTHLY',
                    nextBillingDate: subscription.nextBillingDate || '',
                    autoRenew: subscription.autoRenew != null ? subscription.autoRenew : true,
                    paymentMethod: subscription.paymentMethod || 'UPI',
                    notes: subscription.notes || ''
                });
            } else {
                setForm(initialForm);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, subscription]);

    const handleChange = (field) => (e) => {
        const value = field === 'autoRenew' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setError(null);
        setLoading(true);
        try {
            const payload = { ...form, amount: Number(form.amount) };
            if (subscription && subscription.id) {
                await updateSubscription(subscription.id, payload);
                setSuccessOpen(true);
            } else {
                await createSubscription(payload);
                setSuccessOpen(true);
            }

            // show success briefly, then refresh parent and close
            setTimeout(() => {
                setSuccessOpen(false);
                onSuccess();
                onClose();
            }, 800);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to save subscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{subscription ? 'Edit Subscription' : 'Add Subscription'}</DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Snackbar open={successOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        {subscription ? 'Subscription updated' : 'Subscription created successfully'}
                    </Alert>
                </Snackbar>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField label="Name" fullWidth value={form.name} onChange={handleChange('name')} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField select label="Category" fullWidth value={form.category} onChange={handleChange('category')}>
                            {CATEGORIES.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Amount" type="number" fullWidth value={form.amount} onChange={handleChange('amount')} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label="Currency" fullWidth value={form.currency} onChange={handleChange('currency')} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField select label="Billing Period" fullWidth value={form.billingPeriod} onChange={handleChange('billingPeriod')}>
                            {BILLING_PERIODS.map((b) => (
                                <MenuItem key={b} value={b}>
                                    {b}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Next Billing Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={form.nextBillingDate}
                            onChange={handleChange('nextBillingDate')}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField select label="Payment Method" fullWidth value={form.paymentMethod} onChange={handleChange('paymentMethod')}>
                            {PAYMENT_METHODS.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="Notes" fullWidth multiline rows={2} value={form.notes} onChange={handleChange('notes')} />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox checked={form.autoRenew} onChange={handleChange('autoRenew')} />} label="Auto renew" />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {subscription ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
