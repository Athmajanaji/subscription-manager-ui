// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { getSubscriptions } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';

function currency(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

function tinySparkline(values = [], color = '#4f46e5') {
  const w = 120, h = 28, padding = 4;
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((v, i) => {
    const x = padding + (i / Math.max(1, values.length - 1)) * (w - padding * 2);
    const y = padding + (1 - ((v - min) / Math.max(1e-6, max - min))) * (h - padding * 2);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard() {
  const auth = useAuth();
  const [kpis, setKpis] = useState({ total: 0, monthly: 0, upcoming: 0, overdue: 0 });
  const [byCategory, setByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // fetch first page with many items (adjust if you have more)
        const page = await getSubscriptions(0, 200, 'nextBillingDate,asc');
        const subs = page?.content || [];

        // compute KPIs
        const total = subs.length;
        const today = new Date();
        let monthly = 0;
        let upcoming = 0;
        let overdue = 0;
        const catMap = {};

        for (const s of subs) {
          const amt = Number(s.amount) || 0;
          // assume monthly if billingPeriod contains 'month' or 'monthly'
          const monthlyFactor = (/month/i).test(s.billingPeriod || '') ? 1 : (/year/i).test(s.billingPeriod || '') ? 1/12 : 1;
          monthly += amt * monthlyFactor;

          const nb = s.nextBillingDate ? new Date(s.nextBillingDate) : null;
          if (nb) {
            const diff = Math.floor((new Date(nb.getFullYear(), nb.getMonth(), nb.getDate()) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (24*60*60*1000));
            if (diff < 0) overdue += 1;
            else if (diff <= 7) upcoming += 1;
          }

          const cat = s.category || 'Uncategorized';
          catMap[cat] = (catMap[cat] || 0) + 1;
        }

        const byCat = Object.entries(catMap).map(([k,v]) => ({ category: k, count: v })).sort((a,b) => b.count - a.count);

        if (mounted) {
          setKpis({ total, monthly: Math.round(monthly*100)/100, upcoming, overdue });
          setByCategory(byCat);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Welcome back{auth.user ? `, ${auth.user.name || auth.user.email}` : ''}!</Typography>
        </div>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="subtitle2" className="muted">Total subscriptions</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{kpis.total}</Typography>
            <Box sx={{ mt: 1 }}>{tinySparkline([2,3,4,5,6, kpis.total || 1])}</Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="subtitle2" className="muted">Estimated monthly spend</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{currency(kpis.monthly, 'USD')}</Typography>
            <Box sx={{ mt: 1 }}>{tinySparkline([kpis.monthly*0.6, kpis.monthly*0.8, kpis.monthly*0.9, kpis.monthly])}</Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="subtitle2" className="muted">Renewing soon</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{kpis.upcoming}</Typography>
            <Box sx={{ mt: 1 }}>{tinySparkline([1,1,2,3, kpis.upcoming || 0], '#f59e0b')}</Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="subtitle2" className="muted">Overdue</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: kpis.overdue ? 'error.main' : 'text.primary' }}>{kpis.overdue}</Typography>
            <Box sx={{ mt: 1 }}>{tinySparkline([0,0,1, kpis.overdue || 0], '#ef4444')}</Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="h6">Category breakdown</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
              {byCategory.map((c) => (
                <Chip key={c.category} label={`${c.category} (${c.count})`} sx={{ mr: 1, mb: 1 }} />
              ))}
              {!byCategory.length && <Typography className="muted">No categories yet</Typography>}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper className="card-like" sx={{ p: 3 }}>
            <Typography variant="h6">Upcoming renewals</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography className="muted">Next 7 days</Typography>
              <Typography sx={{ mt: 1 }}>{kpis.upcoming} subscriptions renewing soon</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
