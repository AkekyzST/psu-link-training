import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  DataGrid,
  GridToolbar,
} from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useLinkStore from '~/stores/links';
import useAuthStore from '~/stores/auth';
import { useToastStore } from '~/stores/toast';
import LinkCreateForm from '~/components/LinkCreateForm';
import LinkEditDialog from '~/components/LinkEditDialog';
import QRCodeGenerator from '~/components/QRCodeGenerator';
import type { LinkEntry } from '~/stores/links';

dayjs.extend(relativeTime);

export default function Dashboard() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    links,
    isLoading,
    getUserLinks,
    deleteLink,
    pagination,
    setPagination,
  } = useLinkStore();
  const { showSuccess, showError } = useToastStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkEntry | null>(null);
  const [qrLink, setQrLink] = useState<LinkEntry | null>(null);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<LinkEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pagination.max || 50,
  });

  // Load links on mount
  useEffect(() => {
    getUserLinks();
  }, []);

  // Get base URL for generating full links
  const getFullShortUrl = (shortCode: string) => {
    const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
    return `${baseUrl}/s/${shortCode}`;
  };

  // Copy link to clipboard
  const handleCopyLink = async (shortCode: string) => {
    try {
      const fullUrl = getFullShortUrl(shortCode);
      await navigator.clipboard.writeText(fullUrl);
      showSuccess(intl.formatMessage({ id: 'link.copy.success' }));
    } catch (error) {
      showError(intl.formatMessage({ id: 'link.copy.error' }));
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmLink) return;
    
    try {
      await deleteLink(deleteConfirmLink.id);
      showSuccess(intl.formatMessage({ id: 'link.delete.success' }));
      setDeleteConfirmLink(null);
      getUserLinks(); // Refresh the list
    } catch (error) {
      showError(intl.formatMessage({ id: 'link.delete.error' }));
    }
  };

  // Get status chip for link
  const getStatusChip = (link: LinkEntry) => {
    const now = dayjs();
    const start = link.startDateTime ? dayjs(link.startDateTime) : null;
    const end = link.endDateTime ? dayjs(link.endDateTime) : null;
    
    if (!link.enabled) {
      return (
        <Chip
          label={intl.formatMessage({ id: 'link.status.inactive' })}
          color="default"
          size="small"
        />
      );
    }
    
    if (start && now.isBefore(start)) {
      return (
        <Chip
          label={intl.formatMessage({ id: 'link.status.inactive' })}
          color="warning"
          size="small"
        />
      );
    }
    
    if (end && now.isAfter(end)) {
      return (
        <Chip
          label={intl.formatMessage({ id: 'link.status.expired' })}
          color="error"
          size="small"
        />
      );
    }
    
    return (
      <Chip
        label={intl.formatMessage({ id: 'link.status.active' })}
        color="success"
        size="small"
      />
    );
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'shortCode',
      headerName: intl.formatMessage({ id: 'link.column.shortCode' }),
      width: 120,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '1rem' }}>🔗</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {params.row.shortCode}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'originalUrl',
      headerName: intl.formatMessage({ id: 'link.column.url' }),
      flex: 1,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Tooltip title={params.row.originalUrl}>
          <Typography variant="body2" noWrap>
            {params.row.originalUrl}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'description',
      headerName: intl.formatMessage({ id: 'link.column.description' }),
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Typography variant="body2" noWrap>
          {params.row.description || '-'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: intl.formatMessage({ id: 'link.column.status' }),
      width: 120,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => getStatusChip(params.row),
    },
    {
      field: 'accessCount',
      headerName: intl.formatMessage({ id: 'link.column.accessCount' }),
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Typography variant="body2">
          {params.row.accessCount.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: intl.formatMessage({ id: 'link.column.createdAt' }),
      width: 150,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Tooltip title={dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
          <Typography variant="body2">
            {dayjs(params.row.createdAt).fromNow()}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: intl.formatMessage({ id: 'link.column.actions' }),
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams<LinkEntry>) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={intl.formatMessage({ id: 'link.action.copy' })}>
            <IconButton
              size="small"
              onClick={() => handleCopyLink(params.row.shortCode)}
            >
              <Typography sx={{ fontSize: '1rem' }}>📋</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'link.action.qr' })}>
            <IconButton
              size="small"
              onClick={() => setQrLink(params.row)}
            >
              <Typography sx={{ fontSize: '1rem' }}>QR</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'link.action.stats' })}>
            <IconButton
              size="small"
              onClick={() => navigate(`/links/${params.row.id}/stats`)}
            >
              <Typography sx={{ fontSize: '1rem' }}>📊</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'link.action.edit' })}>
            <IconButton
              size="small"
              onClick={() => setEditingLink(params.row)}
            >
              <Typography sx={{ fontSize: '1rem' }}>✏️</Typography>
            </IconButton>
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'link.action.delete' })}>
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteConfirmLink(params.row)}
            >
              <Typography sx={{ fontSize: '1rem' }}>🗑️</Typography>
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Filter links based on search term
  const filteredLinks = links.filter((link) => {
    const search = searchTerm.toLowerCase();
    return (
      link.shortCode.toLowerCase().includes(search) ||
      link.originalUrl.toLowerCase().includes(search) ||
      (link.description && link.description.toLowerCase().includes(search))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {intl.formatMessage({ id: 'link.dashboard.title' })}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Typography>➕</Typography>}
            onClick={() => setShowCreateForm(true)}
          >
            {intl.formatMessage({ id: 'link.dashboard.createNew' })}
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={intl.formatMessage({ id: 'common.search' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography>🔍</Typography>
              </InputAdornment>
            ),
          }}
        />

        {/* Data Grid */}
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredLinks}
            columns={columns}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel(model);
              setPagination({
                max: model.pageSize,
                offset: model.page * model.pageSize,
              });
              getUserLinks({
                max: model.pageSize,
                offset: model.page * model.pageSize,
              });
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Create Form Dialog */}
      <Dialog
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <LinkCreateForm
            onSuccess={(shortCode) => {
              setShowCreateForm(false);
              getUserLinks(); // Refresh the list
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingLink && (
        <LinkEditDialog
          link={editingLink}
          open={!!editingLink}
          onClose={() => setEditingLink(null)}
          onSuccess={() => {
            setEditingLink(null);
            getUserLinks(); // Refresh the list
          }}
        />
      )}

      {/* QR Code Dialog */}
      {qrLink && (
        <Dialog
          open={!!qrLink}
          onClose={() => setQrLink(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            QR Code - {qrLink.shortCode}
          </DialogTitle>
          <DialogContent>
            <QRCodeGenerator
              link={qrLink}
              fullUrl={getFullShortUrl(qrLink.shortCode)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrLink(null)}>
              {intl.formatMessage({ id: 'common.close' })}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmLink}
        onClose={() => setDeleteConfirmLink(null)}
      >
        <DialogTitle>
          {intl.formatMessage({ id: 'common.delete' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {intl.formatMessage({ id: 'link.delete.confirm' })}
          </DialogContentText>
          {deleteConfirmLink && (
            <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace' }}>
              {deleteConfirmLink.shortCode}: {deleteConfirmLink.originalUrl}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmLink(null)}>
            {intl.formatMessage({ id: 'common.cancel' })}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            {intl.formatMessage({ id: 'common.delete' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}