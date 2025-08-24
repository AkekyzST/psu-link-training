import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import { useIntl } from 'react-intl';
import useAuthStore from '~/stores/auth';
import LanguageSwitcher from './LanguageSwitcher';
import { type Locale } from '~/i18n';

interface AppHeaderProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  currentLocale,
  onLocaleChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleProfileMenuClose();
    handleMobileMenuClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: { minWidth: 200 },
      }}
    >
      <MenuItem onClick={() => handleNavigation('/')}>
        <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>🏠</Typography>
        {intl.formatMessage({ id: 'nav.home' })}
      </MenuItem>
      {isAuthenticated && (
        <MenuItem onClick={() => handleNavigation('/dashboard')}>
          <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>📊</Typography>
          {intl.formatMessage({ id: 'nav.dashboard' })}
        </MenuItem>
      )}
      <Divider />
      <Box sx={{ px: 2, py: 1 }}>
        <LanguageSwitcher
          currentLocale={currentLocale}
          onLocaleChange={onLocaleChange}
          variant="compact"
        />
      </Box>
    </Menu>
  );

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: { minWidth: 220 },
      }}
    >
      {user && (
        <>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" color="text.primary">
              {user.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email || user.username}
            </Typography>
            {user.isAdmin && (
              <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                Administrator
              </Typography>
            )}
          </Box>
          <Divider />
        </>
      )}
      <MenuItem onClick={handleLogout}>
        <Typography sx={{ mr: 1, fontSize: '1.2rem' }}>💪</Typography>
        {intl.formatMessage({ id: 'nav.logout' })}
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Logo/Brand */}
        <Box
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
              PSU
            </Typography>
          </Box>
          <Typography variant="h6" component="h1" sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            display: { xs: 'none', sm: 'block' }
          }}>
            Link Shortener
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={() => navigate('/')}
              sx={{ 
                color: isActive('/') ? theme.palette.primary.main : theme.palette.text.secondary,
                fontWeight: isActive('/') ? 600 : 400,
                '&:hover': { backgroundColor: theme.palette.action.hover }
              }}
            >
              {intl.formatMessage({ id: 'nav.home' })}
            </Button>

            {isAuthenticated && (
              <Button
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  color: isActive('/dashboard') ? theme.palette.primary.main : theme.palette.text.secondary,
                  fontWeight: isActive('/dashboard') ? 600 : 400,
                  '&:hover': { backgroundColor: theme.palette.action.hover }
                }}
              >
                {intl.formatMessage({ id: 'nav.dashboard' })}
              </Button>
            )}

            <LanguageSwitcher
              currentLocale={currentLocale}
              onLocaleChange={onLocaleChange}
              variant="compact"
            />

            {isAuthenticated ? (
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                {intl.formatMessage({ id: 'nav.login' })}
              </Button>
            )}
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                >
                  <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main }}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <IconButton
                  onClick={handleMobileMenuOpen}
                  size="small"
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>☰</Typography>
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleMobileMenuOpen}
                  size="small"
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>☰</Typography>
                </IconButton>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate('/login')}
                >
                  {intl.formatMessage({ id: 'nav.login' })}
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>

      {renderProfileMenu}
      {renderMobileMenu}
    </AppBar>
  );
};

export default AppHeader;