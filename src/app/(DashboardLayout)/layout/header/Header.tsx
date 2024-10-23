import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import Link from 'next/link';
// Components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

interface HeaderProps {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: HeaderProps) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    minHeight: '70px', // Applied globally for clarity
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="open sidebar"
          onClick={toggleMobileSidebar}
          sx={{
            display: { lg: 'none', xs: 'inline' },
          }}
        >
          <IconMenu width={20} height={20} />
        </IconButton>

        <Box flexGrow={1} />

        <IconButton
          size="large"
          aria-label="show notifications"
          color="inherit"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size={21} stroke={1.5} />
          </Badge>
        </IconButton>

        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
