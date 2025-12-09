import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
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
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google'; // if missing, install icons
import FacebookIcon from '@mui/icons-material/Facebook';
import { login } from '../services/auth';

export default function Login() {
  const theme = useTheme();

  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validate = () => {
    if (!email) return 'Email is required';
    const emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)) return 'Enter a valid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
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
      const res = await login({ email, password });
      console.log('Login success', res);
      // TODO: store token, navigate to dashboard
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => setShowPassword((s) => !s);

  return (
    <Box
      className="login-background"
      sx={{
        minHeight: '100vh',
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
            minHeight: 480,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          {/* Left visual / branding panel (hidden on small screens) */}
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
              {/* Replace with your logo/img if you have */}
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Subscription Manager
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 360, mb: 3 }}>
              Keep track of all your recurring subscriptions in one beautiful dashboard.
              Never miss a renewal again.
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              {/* simple illustrative block — swap for an SVG/image */}
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
                <Typography variant="h6">Your subscriptions, organized</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right form panel */}
          <Grid item xs={12} sm={7} md={6} sx={{ p: { xs: 3, sm: 6 } }}>
            <Box sx={{ maxWidth: 420, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to continue to your dashboard
                  </Typography>
                </Box>
              </Box>

              <Box component="form" onSubmit={handleSubmit} noValidate>
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
                          onClick={handleTogglePassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label="Remember me"
                  />
                  <Link href="#" underline="hover" variant="body2">
                    Forgot password?
                  </Link>
                </Box>

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
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>

                <Divider sx={{ my: 2 }}>or continue with</Divider>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      fullWidth
                      onClick={() => console.log('Google sign-in (stub)')}
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
                      onClick={() => console.log('Facebook sign-in (stub)')}
                      sx={{ textTransform: 'none' }}
                    >
                      Facebook
                    </Button>
                  </Grid>
                </Grid>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  Don’t have an account?{' '}
                  <Link href="/register" underline="hover">
                    Create account
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
