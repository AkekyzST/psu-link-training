import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { type Locale } from '~/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (locale: Locale) => void;
  variant?: 'button' | 'compact';
}

const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
  },
} as const;

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  onLocaleChange,
  variant = 'button'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (locale: Locale) => {
    onLocaleChange(locale);
    handleClose();
    
    // Store preference in localStorage
    localStorage.setItem('preferred-language', locale);
  };

  const currentLanguage = languages[currentLocale];

  if (variant === 'compact') {
    return (
      <Box>
        <Button
          onClick={handleClick}
          size="small"
          sx={{
            minWidth: 'auto',
            px: 1,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
              {currentLanguage.flag}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 500 }}>
              {currentLocale}
            </Typography>
            <Typography sx={{ fontSize: 16 }}>▼</Typography>
          </Box>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 0.5,
              minWidth: 180,
            },
          }}
        >
          {Object.entries(languages).map(([locale, lang]) => (
            <MenuItem
              key={locale}
              onClick={() => handleLanguageSelect(locale as Locale)}
              selected={locale === currentLocale}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '1.2rem', minWidth: 24 }}>
                {lang.flag}
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {lang.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lang.nativeName}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={<Typography sx={{ fontSize: '1.2rem' }}>🌍</Typography>}
        endIcon={<Typography>▼</Typography>}
        variant="outlined"
        sx={{
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.main + '08',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
            {currentLanguage.flag}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {currentLanguage.name}
          </Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
          },
        }}
      >
        {Object.entries(languages).map(([locale, lang]) => (
          <MenuItem
            key={locale}
            onClick={() => handleLanguageSelect(locale as Locale)}
            selected={locale === currentLocale}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1.5,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '1.3rem', minWidth: 28 }}>
              {lang.flag}
            </Typography>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lang.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.nativeName}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;