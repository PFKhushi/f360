import React from 'react'
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-quinary)',
    color: 'var(--color-primary)',
    boxShadow: theme.shadows[1],
    fontSize: 12,
    borderRadius: '0px 8px 0px 8px',
  },
  "& .MuiTooltip-arrow": {
    color: 'var(--color-secondary)',
    filter: "drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.2))",
  },
}));
