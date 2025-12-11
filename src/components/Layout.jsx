// src/components/Layout.jsx
import React from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SubscriptionsIcon from '@mui/icons-material/AutoRenew'; // or use SubscriptionsIcon choice
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, to: '/dashboard' },
  { key: 'subscriptions', label: 'Subscriptions', icon: <SubscriptionsIcon />, to: '/subscriptions' },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon />, to: '/settings' },
];

export default function Layout({ children }) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleAvatarClose();
    auth.logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src="/logo192.png"
          alt="logo"
          sx={{ width: 44, height: 44, borderRadius: 1 }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            SubsManager
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Personal Organizer
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ p: 1 }}>
        {navItems.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.25 }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.to}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.active, &:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </motion.div>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Need help?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <IconButton size="small" color="primary" onClick={() => navigate('/subscriptions')}>
            <AddIcon />
          </IconButton>
          <Tooltip title="Logout">
            <IconButton size="small" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          {mobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline-block' }, fontWeight: 700 }}>
              SubsManager
            </Box>

            {/* search placeholder */}
            <Box
              sx={{
                ml: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'action.hover',
                px: 1,
                borderRadius: 1
              }}
            >
              <SearchIcon fontSize="small" sx={{ opacity: 0.7 }} />
              <InputBase placeholder="Search subscriptions..." sx={{ ml: 1, width: 220 }} />
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="large" color="inherit" aria-label="notifications">
              <Badge badgeContent={3} color="error">
                <NotificationsIconFallback />
              </Badge>
            </IconButton>

            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar alt={auth.user?.name || auth.user?.email} src="/avatar.png">
                {auth.user?.name ? auth.user.name.charAt(0) : (auth.user?.email || 'U').charAt(0)}
              </Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleAvatarClose}>
              <MenuItem onClick={() => { handleAvatarClose(); navigate('/profile'); }}>Profile</MenuItem>
              <MenuItem onClick={() => { handleAvatarClose(); navigate('/settings'); }}>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for desktop & mobile */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop persistent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/**
 * Small fallback for NotificationsIcon since some setups might not have it imported.
 * Replace with "@mui/icons-material/Notifications" in your project if available.
 */
function NotificationsIconFallback() {
  // simple bell emoji as fallback
  return <span style={{ fontSize: 20 }}>🔔</span>;
}
