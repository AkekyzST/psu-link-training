import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import QRCode from 'qrcode';
import { useIntl } from 'react-intl';
import { saveAs } from 'file-saver';
import { useToastStore } from '~/stores/toast';
import type { LinkEntry } from '~/stores/links';

interface QRCodeGeneratorProps {
  link: LinkEntry;
  fullUrl: string;
}

type QRErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link, fullUrl }) => {
  const intl = useIntl();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { showSuccess, showError } = useToastStore();
  
  const [size, setSize] = useState(256);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QRErrorCorrectionLevel>('M');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate QR code
  const generateQRCode = async () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      
      // Generate QR code
      await QRCode.toCanvas(canvas, fullUrl, {
        width: size,
        errorCorrectionLevel,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      
      // Add logo if requested
      if (link.withLogo) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const logoUrl = import.meta.env.VITE_QR_LOGO_URL || '/psu-logo.png';
          const logo = new Image();
          
          logo.onload = () => {
            // Calculate logo size (20% of QR code)
            const logoSize = size * 0.2;
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = 'white';
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            
            // Draw logo
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
            
            // Add subtitle if provided
            if (link.qrSubtitle) {
              ctx.fillStyle = 'black';
              ctx.font = `${size * 0.04}px Arial`;
              ctx.textAlign = 'center';
              ctx.fillText(link.qrSubtitle, size / 2, size - 10);
            }
          };
          
          logo.onerror = () => {
            console.error('Failed to load logo');
            // QR code is already generated without logo
          };
          
          logo.src = logoUrl;
        }
      } else if (link.qrSubtitle) {
        // Add subtitle without logo
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'black';
          ctx.font = `${size * 0.04}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(link.qrSubtitle, size / 2, size - 10);
        }
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      showError(intl.formatMessage({ id: 'qr.generate.error' }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate QR code when settings change
  useEffect(() => {
    generateQRCode();
  }, [size, errorCorrectionLevel, link.withLogo, link.qrSubtitle]);

  // Download QR code as PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `qr-${link.shortCode}.png`);
        showSuccess(intl.formatMessage({ id: 'qr.download.success' }));
      } else {
        showError(intl.formatMessage({ id: 'qr.download.error' }));
      }
    });
  };

  // Copy QR code to clipboard
  const handleCopy = async () => {
    if (!canvasRef.current) return;
    
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          showSuccess(intl.formatMessage({ id: 'qr.copy.success' }));
        } else {
          throw new Error('Failed to create image blob');
        }
      });
    } catch (error) {
      console.error('Failed to copy QR code:', error);
      // Fallback: copy the URL instead
      try {
        await navigator.clipboard.writeText(fullUrl);
        showSuccess(intl.formatMessage({ id: 'qr.copyUrl.success' }));
      } catch (fallbackError) {
        showError(intl.formatMessage({ id: 'qr.copy.error' }));
      }
    }
  };

  return (
    <Box>
      {/* QR Code Display */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: 4,
            backgroundColor: 'white',
          }}
        />
        
        {/* URL Display */}
        <Typography
          variant="body2"
          sx={{ mt: 2, fontFamily: 'monospace', wordBreak: 'break-all' }}
        >
          {fullUrl}
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* QR Code Settings */}
      <Stack spacing={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          {intl.formatMessage({ id: 'qr.settings.title' })}
        </Typography>

        {/* Size Selection */}
        <FormControl fullWidth>
          <InputLabel>{intl.formatMessage({ id: 'qr.settings.size' })}</InputLabel>
          <Select
            value={size}
            label={intl.formatMessage({ id: 'qr.settings.size' })}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <MenuItem value={128}>128x128</MenuItem>
            <MenuItem value={256}>256x256</MenuItem>
            <MenuItem value={512}>512x512</MenuItem>
            <MenuItem value={1024}>1024x1024</MenuItem>
          </Select>
        </FormControl>

        {/* Error Correction Level */}
        <FormControl fullWidth>
          <InputLabel>{intl.formatMessage({ id: 'qr.settings.errorCorrection' })}</InputLabel>
          <Select
            value={errorCorrectionLevel}
            label={intl.formatMessage({ id: 'qr.settings.errorCorrection' })}
            onChange={(e) => setErrorCorrectionLevel(e.target.value as QRErrorCorrectionLevel)}
          >
            <MenuItem value="L">
              {intl.formatMessage({ id: 'qr.errorLevel.low' })} (7%)
            </MenuItem>
            <MenuItem value="M">
              {intl.formatMessage({ id: 'qr.errorLevel.medium' })} (15%)
            </MenuItem>
            <MenuItem value="Q">
              {intl.formatMessage({ id: 'qr.errorLevel.quartile' })} (25%)
            </MenuItem>
            <MenuItem value="H">
              {intl.formatMessage({ id: 'qr.errorLevel.high' })} (30%)
            </MenuItem>
          </Select>
        </FormControl>

        {/* QR Settings Info */}
        {link.withLogo && (
          <Typography variant="caption" color="text.secondary">
            {intl.formatMessage({ id: 'qr.info.logo' })}
          </Typography>
        )}
        {link.qrSubtitle && (
          <Typography variant="caption" color="text.secondary">
            {intl.formatMessage({ id: 'qr.info.subtitle' })}: {link.qrSubtitle}
          </Typography>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Action Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<Typography>⬇️</Typography>}
          onClick={handleDownload}
          disabled={isGenerating}
          fullWidth
        >
          {intl.formatMessage({ id: 'qr.action.download' })}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Typography>📋</Typography>}
          onClick={handleCopy}
          disabled={isGenerating}
          fullWidth
        >
          {intl.formatMessage({ id: 'qr.action.copy' })}
        </Button>
      </Stack>
    </Box>
  );
};

export default QRCodeGenerator;