// src/pages/Register.jsx
import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  Checkbox,
  useTheme
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { login } from '../services/auth'; // we will use register flow that returns fake token (we reuse stub)
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!name) return 'Name is required';
    if (!email) return 'Email is required';
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) return 'Enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!acceptTerms) return 'You must accept the terms and conditions';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      // For now we reuse the login stub as fake register — replace later with real register API.
      const res = await new Promise((resolve) =>
        setTimeout(() => resolve({ token: 'fake-jwt-token', user: { name, email } }), 700)
      );
      console.log('Register success', res);
      // Optionally store token, then navigate to dashboard. For now, redirect to login.
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            display: 'flex',
            borderRadius: 3,
            overflow: 'hidden',
            minHeight: 520,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          {/* Left branding panel (hidden on xs) */}
          <Grid
            item
            xs={0}
            sm={5}
            md={6}
            sx={{
              display: { xs: 'none', sm: 'block' },
              background:
                'linear-gradient(135deg, rgba(63,81,181,0.95) 0%, rgba(103,58,183,0.9) 100%)',
              color: '#fff',
              p: 6,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            container
            direction="column"
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Subscription Manager
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 360, mb: 3 }}>
              Create your account to manage subscriptions, track costs, and receive renewal reminders.
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              <Box
                sx={{
                  width: '100%',
                  height: 220,
                  borderRadius: 2,
                  background:
                    'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.15), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.05), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="h6">Join and take control</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right form panel */}
          <Grid item xs={12} sm={7} md={6} sx={{ p: { xs: 3, sm: 6 } }}>
            <Box sx={{ maxWidth: 420, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <HowToRegIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Create account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start your free account and manage subscriptions easily
                  </Typography>
                </Box>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  disabled={loading}
                />

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the <Link href="#">Terms of Service</Link> and{' '}
                      <Link href="#">Privacy Policy</Link>.
                    </Typography>
                  }
                  sx={{ mt: 1 }}
                />

                {error && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3, mb: 1, py: 1.25 }}
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>

                <Divider sx={{ my: 2 }}>or sign up with</Divider>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      fullWidth
                      onClick={() => console.log('Google sign-up (stub)')}
                      sx={{ textTransform: 'none' }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      fullWidth
                      onClick={() => console.log('Facebook sign-up (stub)')}
                      sx={{ textTransform: 'none' }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                </Grid>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  Already have an account?{' '}
                  <Link href="/login" underline="hover">
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
