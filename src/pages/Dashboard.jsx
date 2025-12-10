// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back{auth.user ? `, ${auth.user.name || auth.user.email}` : ''}!
          </Typography>
        </div>

        <div>
          <Button
            variant="outlined"
            onClick={() => {
              auth.logout();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </div>
      </Box>

      <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
        <Typography variant="h6">Quick overview</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          This is a placeholder dashboard. We will add subscription lists, charts, and stats here in later tasks.
        </Typography>
      </Box>
    </Container>
  );
}
