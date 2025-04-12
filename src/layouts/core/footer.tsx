import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FacebookIcon from '@mui/icons-material/GitHub';
import { Tooltip } from '@mui/material';

import InstallPwa from '../../mui-components/InstallPwa';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import UpdatePwa from '../../mui-components/UpdatePwa';

export default function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 4, sm: 8 },
          py: { xs: 8, sm: 10 },
          textAlign: { sm: 'center', md: 'left' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: { xs: 4, sm: 8 },
            width: '100%',
            borderTop: '1px solid',
            borderColor: 'divider',
            gap: { xs: 2, sm: 4 }, // Space between text and icons
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile, horizontally on larger screens
          }}
        >
          <div style={{ width: '100%' }}>
            <div>
              <Link
                color="text.secondary"
                href="https://especializacao.ccec.puc-rio.br/especializacao/desenvolvimento-full-stack"
                target="_blank"
                sx={{ '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}>
                MVP 3 - Puc Rio  <div className='test-update-cache'>v7</div>
                <br /> Pós Graduação Desenvolvimento Full Stack
              </Link>

            </div>
            <div>
              <Link
                color="text.secondary"
                href="https://leonardopaiva.com"
                target="_blank"
                sx={{ '&:hover': { color: 'primary.main' }, textDecoration: 'none' }}>
                Leonardo Souza Paiva - www.leonardopaiva.com
              </Link>
            </div>
            <Typography sx={{ color: 'text.secondary' }}>© Copyright 2025. All Rights Reserved by </Typography>
          </div>

          {/* Icons section */}
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              justifyContent: 'flex-end',
              gap: { xs: 1, sm: 1 },
              alignItems: 'center',
              flexWrap: 'nowrap',
            }}
          >
            <InstallPwa />
            <UpdatePwa />

            <ColorModeIconDropdown size="small" sx={{ alignSelf: 'center' }} />

            <Typography variant="body2" sx={{
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              fontSize: '1.5rem',
              color: 'text.disabled',
              display: { xs: 'none', md: 'block' }
            }}>
              /
            </Typography>

            <Tooltip title="Ver projeto no github - Componente Principal Gateway Api" arrow>
              <IconButton
                color="inherit"
                size="small"
                href="https://github.com/leonardopaiva/pucrio-mvp-des-fs-advanced-micro-gateway-api"
                aria-label="GitHub"
                target="_blank"
                sx={{ alignSelf: 'center' }}
              >
                <FacebookIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
}
