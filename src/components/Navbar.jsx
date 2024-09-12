import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FitbitIcon from '@mui/icons-material/Fitbit';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Badge,
  Box,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../constants/role';
import { toggleDarkMode } from '../redux/themeSlice';
import { MaterialUISwitch } from '../themes/switch';

const Navbar = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { darkMode } = useSelector((state) => state.theme);
  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleThemeChange = () => {
    dispatch(toggleDarkMode()); // Dispatch action to toggle dark mode
  };

  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'grey.800' }}>
        <Toolbar>
          <Box display={'flex'} justifyContent={'space-between'} width={{ xs: '100%', md: '80%' }} marginX={'auto'}>
            <Box display={'flex'} alignItems={'center'}>
              <FitbitIcon />
              <Typography
                variant="h6"
                noWrap
                component={'div'}
                sx={{
                  fontFamily: 'Mulish-Black',
                  alignItems: 'center',
                  marginLeft: { xs: '2em', sm: 'unset', md: 2 },
                  fontSize: '24px',
                  fontWeight: '600',
                  lineHeight: '30px',
                  cursor: 'default',
                }}
                onClick={() => navigate('/')}
              >
                Platzi Fake Store API
              </Typography>
            </Box>
            {/* Start DESKTOP MODE */}
            <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
              <FormControlLabel control={<MaterialUISwitch />} defaultChecked={darkMode} defaultValue={darkMode} onChange={handleThemeChange} />
              <Tooltip title="Home" onClick={() => navigate('/')}>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              {role !== ROLES.ADMIN && (
                <Tooltip title="Cart" onClick={() => navigate('/my-cart')}>
                  <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={cart?.length} color="error">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open Setting">
                  <IconButton
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                    onClick={handleOpenUserMenu}
                  >
                    <AccountCircleIcon sx={{ fontSize: { xs: '20px', md: '30px' } }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleSignOut}>
                    <Box display="flex" gap={1}>
                      <ExitToAppIcon />
                      <Typography textAlign="center">Sign Out</Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            {/* END OF DESKTOP MODE */}
            {/* Start MOBILE MODE */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-haspopup="true" aria-label="open sidebar" onClick={handleOpenSidebar} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
            {/* END OF MOBILE MODE */}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          '& .MuiDrawer-paper': {
            width: '50%',
            backgroundColor: '#5B5B5B',
          },
        }}
      >
        <List>
          <ListItemButton>
            <HomeIcon fontSize="small" sx={{ marginLeft: -0.5, color: 'white', marginRight: 0.5 }} />
            <ListItemText
              onClick={() => navigate('/')}
              primary={
                <Link to="/" style={{ textDecoration: 'none', color: '#FDFDFD' }}>
                  Home
                </Link>
              }
            />
          </ListItemButton>
          {role !== ROLES.ADMIN && (
            <ListItemButton sx={{ gap: { xs: 1.5, md: 0 } }}>
              <Badge badgeContent={cart?.length} color="error">
                <ShoppingCartIcon fontSize="small" sx={{ marginLeft: -0.5, color: 'white', marginRight: 0.5 }} />
              </Badge>
              <ListItemText
                onClick={() => navigate('/my-cart')}
                primary={
                  <Link to="/my-cart" style={{ textDecoration: 'none', color: '#FDFDFD' }}>
                    Keranjang Saya
                  </Link>
                }
              />
            </ListItemButton>
          )}
          <ListItemButton onClick={handleSignOut}>
            <LoginIcon fontSize="small" sx={{ marginLeft: -0.5, color: 'white', marginRight: 0.5 }} />
            <ListItemText
              primary={
                <Link to="/" style={{ textDecoration: 'none', color: '#FDFDFD' }}>
                  Sign Out
                </Link>
              }
            />
          </ListItemButton>
          <Box display={'flex'} justifyContent={'center'}>
            <FormControlLabel
              control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked={darkMode} defaultValue={darkMode} />}
              onChange={handleThemeChange}
            />
          </Box>
        </List>
      </Drawer>
    </Box>
  );
};

export default Navbar;
