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
import { decreaseFontSize, increaseFontSize } from '../../util/body-size';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import InstallPwa from '../../mui-components/InstallPwa';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import AppGlobalStatesService from '../../services/AppGlobalStatesService';

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
                  MVP 2 - Puc Rio - Pós Graduação Desenvolvimento Full Stack 
              </Link>
              <div className='test-update-cache'>v3</div>

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
            <Typography sx={{color: 'text.secondary'}}>© Copyright 2024. All Rights Reserved by </Typography>
          </div>

          {/* Icons section */}
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{
              justifyContent: 'flex-end', // Align icons to the right
              gap: { xs: 1, sm: 1 }, // Gap between icons (smaller on mobile)
              alignItems: 'center',
              flexWrap: 'nowrap', // Prevent wrapping of icons on all screen sizes
            }}
          >
            <InstallPwa />
            <Tooltip title="Diminuir tamanho do texto" arrow>
              <IconButton
                color="inherit"
                size="small"
                aria-label="Diminuir fonte"
                sx={{ alignSelf: 'center' }}
                onClick={decreaseFontSize}
              >
                <FormatSizeIcon />
                <RemoveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Aumentar tamanho do texto" arrow>
              <IconButton
                color="inherit"
                size="small"
                aria-label="Aumentar fonte"
                sx={{ alignSelf: 'center' }}
                onClick={increaseFontSize}
              >
                <FormatSizeIcon />
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Example Global State Demonstration, needs to be in appointment page" arrow>
              <IconButton
                color="inherit"
                size="small"
                aria-label="Aumentar fonte"
                sx={{ alignSelf: 'center' }}
                onClick={() => {
                  const valueExampleGlobalState = AppGlobalStatesService.getExampleGlobalState();
                  AppGlobalStatesService.setExampleGlobalState(!valueExampleGlobalState);
                }}
              >
                ?
              </IconButton>
            </Tooltip>

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

            <Tooltip title="Ver projeto no github" arrow>
              <IconButton
                color="inherit"
                size="small"
                href="https://github.com/mui"
                aria-label="GitHub"
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
