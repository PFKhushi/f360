import React from 'react'
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-secondary-2)',
    color: '#ffffff',
    boxShadow: theme.shadows[1],
    fontSize: 14,
    borderRadius: '8px 8px 8px 8px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
  },
  "& .MuiTooltip-arrow": {
    color: 'var(--color-secondary-2)',
    filter: "drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2))",
  },
}));
