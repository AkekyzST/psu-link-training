import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Collapse,
  Stack,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs, { Dayjs } from 'dayjs';
import { useIntl } from 'react-intl';
import useLinkStore from '~/stores/links';
import { useToastStore } from '~/stores/toast';
import type { CreateLinkDto } from '~/stores/links';

// Validation schema
const linkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
  description: z.string().optional(),
  startDateTime: z.any().optional(),
  endDateTime: z.any().optional(),
  withLogo: z.boolean().optional(),
  qrSubtitle: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDateTime && data.endDateTime) {
      return dayjs(data.startDateTime).isBefore(dayjs(data.endDateTime));
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDateTime'],
  }
);

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkCreateFormProps {
  onSuccess?: (shortCode: string) => void;
  onCancel?: () => void;
}

const LinkCreateForm: React.FC<LinkCreateFormProps> = ({ onSuccess, onCancel }) => {
  const intl = useIntl();
  const theme = useTheme();
  const { createLink, isLoading, error, clearError } = useLinkStore();
  const { showSuccess, showError } = useToastStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQrOptions, setShowQrOptions] = useState(false);
  const [urlPreview, setUrlPreview] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      originalUrl: '',
      description: '',
      startDateTime: null,
      endDateTime: null,
      withLogo: false,
      qrSubtitle: '',
    },
    mode: 'onChange',
  });

  const watchedUrl = watch('originalUrl');
  const watchWithLogo = watch('withLogo');
  const watchDescription = watch('description');

  // Generate URL preview
  useEffect(() => {
    if (watchedUrl) {
      try {
        new URL(watchedUrl);
        setIsValidUrl(true);
        const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
        setUrlPreview(`${baseUrl}/s/abc123`);
      } catch {
        setIsValidUrl(false);
        setUrlPreview('');
      }
    } else {
      setIsValidUrl(false);
      setUrlPreview('');
    }
  }, [watchedUrl]);

  const onSubmit = async (data: LinkFormData) => {
    try {
      clearError();
      
      const createData: CreateLinkDto = {
        originalUrl: data.originalUrl,
        description: data.description,
        startDateTime: data.startDateTime ? dayjs(data.startDateTime).toISOString() : undefined,
        endDateTime: data.endDateTime ? dayjs(data.endDateTime).toISOString() : undefined,
        withLogo: data.withLogo,
        qrSubtitle: data.qrSubtitle,
      };

      const newLink = await createLink(createData);
      
      showSuccess(
        intl.formatMessage(
          { id: 'link.create.success' },
          { shortCode: newLink.shortCode }
        )
      );
      
      reset();
      
      if (onSuccess) {
        onSuccess(newLink.shortCode);
      }
    } catch (err: any) {
      showError(
        err.response?.data?.message || 
        intl.formatMessage({ id: 'link.create.error' })
      );
    }
  };

  const handleUrlPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.startsWith('http')) {
        setValue('originalUrl', text);
      }
    } catch (err) {
      // Clipboard access failed, ignore
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {intl.formatMessage({ id: 'link.create.title' })}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Transform your long URLs into short, shareable links
          </Typography>
        </Box>

        {error && (
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }} 
              onClose={clearError}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Main URL Input Section */}
          <Card 
            sx={{ 
              mb: 3, 
              borderRadius: 3,
              border: `2px solid ${isValidUrl ? theme.palette.success.main : 'transparent'}`,
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1, fontSize: '1.5rem' }}>🔗</Typography>
                    Enter Your URL
                  </Typography>
                  
                  <Controller
                    name="originalUrl"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Original URL"
                        placeholder="https://example.com/your-long-url"
                        error={!!errors.originalUrl}
                        helperText={errors.originalUrl?.message}
                        required
                        disabled={isLoading}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography sx={{ fontSize: '1.2rem' }}>
                                {isValidUrl ? '✅' : '🌐'}
                              </Typography>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button 
                                size="small" 
                                onClick={handleUrlPaste}
                                disabled={isLoading}
                                sx={{ minWidth: 'auto' }}
                              >
                                <Typography>📋</Typography>
                              </Button>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description (Optional)"
                      placeholder="Brief description of your link"
                      multiline
                      rows={2}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <Typography>📝</Typography>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />

                {/* URL Preview */}
                {urlPreview && (
                  <Fade in>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Your shortened link will look like:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: theme.palette.success.main,
                          wordBreak: 'break-all',
                        }}
                      >
                        {urlPreview}
                      </Typography>
                    </Box>
                  </Fade>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Advanced Options Toggle */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{
                borderRadius: 20,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              <Typography sx={{ mr: 1 }}>⚙️</Typography>
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
              <Typography sx={{ ml: 1, transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                ▼
              </Typography>
            </Button>
          </Box>

          {/* Advanced Options */}
          <Collapse in={showAdvanced}>
            <Stack spacing={3}>
              {/* Time-based Access */}
              <Card sx={{ borderRadius: 3 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1, fontSize: '1.3rem' }}>⏰</Typography>
                      Time-based Access
                    </Box>
                  }
                  subheader="Set when your link should be active"
                  sx={{ pb: 1 }}
                />
                <CardContent>
                  <Stack spacing={3}>
                    <Controller
                      name="startDateTime"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          label="Start Date & Time (Optional)"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.startDateTime,
                              helperText: (errors.startDateTime?.message as string) || "When the link becomes active",
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="endDateTime"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          label="End Date & Time (Optional)"
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoading}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.endDateTime,
                              helperText: (errors.endDateTime?.message as string) || "When the link expires",
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* QR Code Options */}
              <Card sx={{ borderRadius: 3 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1, fontSize: '1.3rem' }}>QR</Typography>
                        QR Code Customization
                      </Box>
                      <Button
                        size="small"
                        onClick={() => setShowQrOptions(!showQrOptions)}
                        sx={{ textTransform: 'none' }}
                      >
                        {showQrOptions ? 'Hide' : 'Show'}
                      </Button>
                    </Box>
                  }
                  subheader="Customize your QR code appearance"
                  sx={{ pb: 1 }}
                />
                <Collapse in={showQrOptions}>
                  <CardContent>
                    <Stack spacing={3}>
                      <Controller
                        name="withLogo"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}
                                disabled={isLoading}
                                sx={{
                                  color: theme.palette.primary.main,
                                  '&.Mui-checked': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  Include PSU Logo
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Add PSU logo in the center of QR code
                                </Typography>
                              </Box>
                            }
                          />
                        )}
                      />

                      <Controller
                        name="qrSubtitle"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="QR Code Subtitle"
                            placeholder="e.g., PSU Link Shortener"
                            disabled={isLoading || !watchWithLogo}
                            helperText={
                              !watchWithLogo 
                                ? "Enable logo to add subtitle"
                                : "Text displayed below the QR code"
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      />

                      {watchWithLogo && (
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                          }}
                        >
                          <Typography variant="body2" color="info.main">
                            <Typography component="span" sx={{ fontWeight: 600 }}>💡 Tip:</Typography>
                            {' '}QR codes with logos require higher error correction and may be slightly larger.
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            </Stack>
          </Collapse>

          {/* Action Buttons */}
          <Card sx={{ mt: 4, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={isLoading}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading || !isValid}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                    },
                  }}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Typography>🚀</Typography>
                    )
                  }
                >
                  {isLoading
                    ? 'Creating Link...'
                    : 'Create Short Link'
                  }
                </Button>
              </Stack>

              {!isValid && watchedUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Please enter a valid URL to create your short link
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default LinkCreateForm;