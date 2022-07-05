// Core Packages
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import styled from '@emotion/styled';

const StyledTypography = styled(Typography)`
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
        color: inherit;
    }
`;

const Navbar = ({ currentUser }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar position="static" sx={{ background: '#516365' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <IconButton
            component={RouterLink}
            to="/"
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ReceiptIcon />
          </IconButton>
          <StyledTypography component={RouterLink} to="/" variant="h6" color="inherit" sx={{ flexGrow: 1, }}>
            Exam Cohort App
          </StyledTypography>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar src="/linkto" />
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
              {!currentUser && <MenuItem component={RouterLink} to="/signin" onClick={handleCloseUserMenu}> <Typography textAlign="center">Sign In</Typography></MenuItem>}
              {currentUser && <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseUserMenu}> <Typography textAlign="center">Dashboard</Typography></MenuItem>} 
              {currentUser && <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}> <Typography textAlign="center">Profile</Typography></MenuItem>} 
              {currentUser && <MenuItem component={RouterLink} to="/logout" onClick={handleCloseUserMenu}> <Typography textAlign="center">Logout</Typography></MenuItem>} 
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar