import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Stack,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import { useIntl } from "react-intl";
import useAuthStore from "~/stores/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PSU Link Shortener" },
    { name: "description", content: "URL Shortener for Prince of Songkla University" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const intl = useIntl();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const features = [
    {
      icon: <Typography sx={{ fontSize: 40 }}>🔗</Typography>,
      title: intl.formatMessage({ id: 'home.feature.shorten.title' }),
      description: intl.formatMessage({ id: 'home.feature.shorten.description' }),
      color: theme.palette.primary.main,
    },
    {
      icon: <Typography sx={{ fontSize: 40 }}>QR</Typography>,
      title: intl.formatMessage({ id: 'home.feature.qr.title' }),
      description: intl.formatMessage({ id: 'home.feature.qr.description' }),
      color: theme.palette.secondary.main,
    },
    {
      icon: <Typography sx={{ fontSize: 40 }}>🔒</Typography>,
      title: intl.formatMessage({ id: 'home.feature.security.title' }),
      description: intl.formatMessage({ id: 'home.feature.security.description' }),
      color: theme.palette.success.main,
    },
    {
      icon: <Typography sx={{ fontSize: 40 }}>📊</Typography>,
      title: intl.formatMessage({ id: 'home.feature.analytics.title' }),
      description: intl.formatMessage({ id: 'home.feature.analytics.description' }),
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', backgroundColor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}10 100%)`,
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box textAlign="center">
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                {intl.formatMessage({ id: 'home.hero.title' })}
              </Typography>
              
              <Typography 
                variant="h5" 
                color="text.secondary" 
                paragraph
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto', 
                  mb: 4,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                {intl.formatMessage({ id: 'home.hero.subtitle' })}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
                <Typography sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}>🏫</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  Prince of Songkla University
                </Typography>
              </Box>

              {isAuthenticated && user ? (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                    {intl.formatMessage({ id: 'home.welcome' }, { name: user.username })}
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    justifyContent="center"
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Typography>📊</Typography>}
                      onClick={() => navigate("/dashboard")}
                      sx={{ 
                        px: 4, 
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                          boxShadow: theme.shadows[8],
                        }
                      }}
                    >
                      {intl.formatMessage({ id: 'home.dashboard' })}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      color="error"
                      startIcon={<Typography>💪</Typography>}
                      onClick={handleLogout}
                      sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                    >
                      {intl.formatMessage({ id: 'nav.logout' })}
                    </Button>
                  </Stack>
                  
                  {user.isAdmin && (
                    <Typography 
                      variant="body1" 
                      color="primary" 
                      sx={{ 
                        mt: 3, 
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        backgroundColor: theme.palette.primary.main + '15',
                        borderRadius: 2,
                        display: 'inline-block'
                      }}
                    >
                      {intl.formatMessage({ id: 'home.admin.privileges' })}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 3 }}>
                    {intl.formatMessage({ id: 'home.login.prompt' })}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1rem',
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    {intl.formatMessage({ id: 'nav.login' })}
                  </Button>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 6,
            fontSize: { xs: '1.75rem', sm: '2.25rem' }
          }}
        >
          {intl.formatMessage({ id: 'home.features.title' })}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: feature.color + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main + '08',
            py: { xs: 4, md: 6 },
          }}
        >
          <Container maxWidth="md">
            <Fade in timeout={1500}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'home.cta.title' })}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  {intl.formatMessage({ id: 'home.cta.description' })}
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{ 
                    px: 6, 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: theme.shadows[4],
                    '&:hover': {
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  {intl.formatMessage({ id: 'home.cta.button' })}
                </Button>
              </Paper>
            </Fade>
          </Container>
        </Box>
      )}
    </Box>
  );
}
