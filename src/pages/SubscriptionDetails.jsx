import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Paper, Typography, Grid, Chip, Avatar, Stack, Divider, Tooltip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubscriptionById } from '../services/subscriptionService';

export default function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sub, setSub] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubscriptionById(id);
        setSub(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load subscription');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  if (loading) return <Container sx={{ mt: 6 }}>Loading...</Container>;
  if (error) return <Container sx={{ mt: 6 }}><Typography color="error">{error}</Typography></Container>;
  if (!sub) return <Container sx={{ mt: 6 }}><Typography>No subscription found.</Typography></Container>;

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString();
  };

  const providerIconForName = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();
    const domainMap = [
      ['youtube', 'www.youtube.com'],
      ['netflix', 'www.netflix.com'],
      ['spotify', 'www.spotify.com'],
      ['hotstar', 'www.hotstar.com'],
      ['prime', 'www.primevideo.com'],
      ['hulu', 'www.hulu.com'],
      ['disney', 'www.disneyplus.com']
    ];
    for (const [k, domain] of domainMap) {
      if (n.includes(k)) return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
    }
    return null;
  };

  const iconUrl = providerIconForName(sub.name);
  const initials = (sub.name || '').split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase();

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Paper className="card-like details-card" sx={{ p: 5 }} elevation={3}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Box className="details-left" sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 }}>
              <div className="details-avatar-wrap">
                <Avatar
                  src={iconUrl || undefined}
                  alt={sub.name}
                  className="details-avatar"
                  sx={{ width: 140, height: 140, fontSize: 36 }}
                >
                  {!iconUrl && initials}
                </Avatar>
              </div>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', letterSpacing: '-0.5px' }}>{sub.name}</Typography>
                <Typography className="muted" sx={{ mt: 0.5 }}>{sub.category || '—'}</Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={() => navigate('/subscriptions')}>Back</Button>
                <Button variant="contained" onClick={() => navigate('/subscriptions', { state: { editId: sub.id } })}>Edit</Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3} className="details-meta">
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" className="muted">Amount</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>{sub.amount} {sub.currency}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" className="muted">Billing Period</Typography>
                <Typography>{sub.billingPeriod}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" className="muted">Next Billing Date</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{formatDate(sub.nextBillingDate)}</Typography>
                  {(() => {
                    const now = new Date();
                    const nb = new Date(sub.nextBillingDate);
                    const daysLeft = isNaN(nb.getTime()) ? Infinity : Math.floor((new Date(nb.getFullYear(), nb.getMonth(), nb.getDate()) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / (24*60*60*1000));
                    if (daysLeft < 0) return <Chip label="Overdue" size="small" sx={{ bgcolor: (t) => t.palette.error.light, color: (t) => t.palette.getContrastText(t.palette.error.light) }} />;
                    if (daysLeft <= 7) return <Chip label="Renewing soon" size="small" sx={{ bgcolor: (t) => t.palette.warning.light, color: (t) => t.palette.getContrastText(t.palette.warning.light || t.palette.warning.main) }} />;
                    return null;
                  })()}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" className="muted">Auto renew</Typography>
                <Typography>{sub.autoRenew ? 'Yes' : 'No'}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" className="muted">Payment Method</Typography>
                <Typography>{sub.paymentMethod}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" className="muted">Notes</Typography>
                <Typography>{sub.notes || '—'}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" className="muted">Created At</Typography>
                <Typography>{formatDate(sub.createdAt || sub.created)}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
