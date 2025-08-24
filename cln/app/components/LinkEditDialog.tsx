import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import useLinkStore from '~/stores/links';
import { useToastStore } from '~/stores/toast';
import type { LinkEntry, UpdateLinkDto } from '~/stores/links';

// Validation schema for editing
const editLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL is required')
    .url('Please enter a valid URL'),
  description: z.string().optional(),
  enabled: z.boolean(),
  startDateTime: z.any().optional(),
  endDateTime: z.any().optional(),
  withLogo: z.boolean(),
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

type EditLinkFormData = z.infer<typeof editLinkSchema>;

interface LinkEditDialogProps {
  link: LinkEntry;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LinkEditDialog: React.FC<LinkEditDialogProps> = ({
  link,
  open,
  onClose,
  onSuccess,
}) => {
  const intl = useIntl();
  const { updateLink, isLoading, error, clearError } = useLinkStore();
  const { showSuccess, showError } = useToastStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditLinkFormData>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      originalUrl: link.originalUrl,
      description: link.description || '',
      enabled: link.enabled,
      startDateTime: link.startDateTime ? dayjs(link.startDateTime) : null,
      endDateTime: link.endDateTime ? dayjs(link.endDateTime) : null,
      withLogo: link.withLogo,
      qrSubtitle: link.qrSubtitle || '',
    },
  });

  // Reset form when link changes
  useEffect(() => {
    reset({
      originalUrl: link.originalUrl,
      description: link.description || '',
      enabled: link.enabled,
      startDateTime: link.startDateTime ? dayjs(link.startDateTime) : null,
      endDateTime: link.endDateTime ? dayjs(link.endDateTime) : null,
      withLogo: link.withLogo,
      qrSubtitle: link.qrSubtitle || '',
    });
  }, [link, reset]);

  const onSubmit = async (data: EditLinkFormData) => {
    try {
      clearError();
      
      const updateData: UpdateLinkDto = {
        originalUrl: data.originalUrl,
        description: data.description,
        enabled: data.enabled,
        startDateTime: data.startDateTime ? dayjs(data.startDateTime).toISOString() : undefined,
        endDateTime: data.endDateTime ? dayjs(data.endDateTime).toISOString() : undefined,
        withLogo: data.withLogo,
        qrSubtitle: data.qrSubtitle,
      };

      await updateLink(link.id, updateData);
      
      showSuccess(
        intl.formatMessage(
          { id: 'link.edit.success' },
          { shortCode: link.shortCode }
        )
      );
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err: any) {
      showError(
        err.response?.data?.message || 
        intl.formatMessage({ id: 'link.edit.error' })
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {intl.formatMessage({ id: 'link.edit.title' })} - {link.shortCode}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
                {error}
              </Alert>
            )}

            <Grid container spacing={2}>
              {/* URL Input */}
              <Grid item xs={12}>
                <Controller
                  name="originalUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={intl.formatMessage({ id: 'link.field.url' })}
                      error={!!errors.originalUrl}
                      helperText={errors.originalUrl?.message}
                      required
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={intl.formatMessage({ id: 'link.field.description' })}
                      multiline
                      rows={2}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>

              {/* Enabled Status */}
              <Grid item xs={12}>
                <Controller
                  name="enabled"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value}
                          disabled={isLoading}
                        />
                      }
                      label={intl.formatMessage({ id: 'link.field.enabled' })}
                    />
                  )}
                />
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="startDateTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label={intl.formatMessage({ id: 'link.field.startDate' })}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startDateTime,
                          helperText: errors.startDateTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="endDateTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label={intl.formatMessage({ id: 'link.field.endDate' })}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endDateTime,
                          helperText: errors.endDateTime?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* QR Code Options */}
              <Grid item xs={12}>
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
                        />
                      }
                      label={intl.formatMessage({ id: 'link.field.withLogo' })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="qrSubtitle"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={intl.formatMessage({ id: 'link.field.qrSubtitle' })}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={onClose} disabled={isLoading}>
              {intl.formatMessage({ id: 'common.cancel' })}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {isLoading
                ? intl.formatMessage({ id: 'common.saving' })
                : intl.formatMessage({ id: 'common.save' })
              }
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default LinkEditDialog;