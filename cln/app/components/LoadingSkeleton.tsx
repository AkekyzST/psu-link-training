import React from 'react';
import { 
  Skeleton, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  useTheme 
} from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'dashboard' | 'form' | 'card' | 'table' | 'list' | 'profile';
  count?: number;
  height?: number | string;
  width?: number | string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 1,
  height = 'auto',
  width = '100%'
}) => {
  const theme = useTheme();

  const renderDashboardSkeleton = () => (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="20%" height={40} />
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={32} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Data Grid */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="25%" height={32} />
        </Box>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <Skeleton variant="text" width="15%" height={24} />
            <Skeleton variant="text" width="30%" height={24} />
            <Skeleton variant="text" width="20%" height={24} />
            <Skeleton variant="text" width="15%" height={24} />
            <Skeleton variant="text" width="10%" height={24} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        ))}
      </Paper>
    </Box>
  );

  const renderFormSkeleton = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
      
      <Stack spacing={3}>
        {[...Array(4)].map((_, index) => (
          <Box key={index}>
            <Skeleton variant="text" width="25%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        </Box>
      </Stack>
    </Paper>
  );

  const renderCardSkeleton = () => (
    <Card sx={{ height: height }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
        
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="85%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );

  const renderTableSkeleton = () => (
    <Paper sx={{ width: '100%' }}>
      {/* Table Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="text" width="15%" height={24} />
          ))}
        </Box>
      </Box>
      
      {/* Table Rows */}
      {[...Array(count)].map((_, rowIndex) => (
        <Box 
          key={rowIndex} 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 2,
            alignItems: 'center'
          }}
        >
          {[...Array(6)].map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="15%" height={20} />
          ))}
        </Box>
      ))}
    </Paper>
  );

  const renderListSkeleton = () => (
    <Paper sx={{ width: '100%' }}>
      {[...Array(count)].map((_, index) => (
        <Box
          key={index}
          sx={{ 
            p: 2, 
            borderBottom: index < count - 1 ? `1px solid ${theme.palette.divider}` : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
          <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Paper>
  );

  const renderProfileSkeleton = () => (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
      
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    </Paper>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dashboard':
        return renderDashboardSkeleton();
      case 'form':
        return renderFormSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'card':
      default:
        return [...Array(count)].map((_, index) => (
          <Box key={index} sx={{ mb: index < count - 1 ? 2 : 0 }}>
            {renderCardSkeleton()}
          </Box>
        ));
    }
  };

  return (
    <Box sx={{ width, height }}>
      {renderVariant()}
    </Box>
  );
};

export default LoadingSkeleton;