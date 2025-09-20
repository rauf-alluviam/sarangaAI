import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { keyframes } from '@mui/system';

// Enhanced shine animation keyframes
const shineAnimation = keyframes`
  0% { 
    transform: translateX(-100%) rotate(-10deg); 
    opacity: 0;
  }
  50% { 
    opacity: 1; 
  }
  100% { 
    transform: translateX(100%) rotate(-10deg); 
    opacity: 0;
  }
`;

const pulseAnimation = keyframes`
  0%, 100% { 
    transform: scale(1); 
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05); 
    filter: brightness(1.2);
  }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

// Spinning animation for hover
const spinAnimation = keyframes`
  0% { transform: perspective(100px) rotateX(15deg) rotateZ(0deg); }
  100% { transform: perspective(100px) rotateX(15deg) rotateZ(360deg); }
`;

// Enhanced 3D star styles with SOLID COLORS for the stars
const star3DStyles = {
  silver: {
    color: '#C0C0C0', // Silver color for the star
    textShadow: `
      0 1px 0 #FFFFFF,
      0 2px 1px rgba(0,0,0,0.3),
      0 4px 8px rgba(192,192,192,0.6)
    `,
    filter: 'drop-shadow(0 2px 4px rgba(192,192,192,0.4))',
  },
  gold: {
    color: '#FFD700', // Gold color for the star
    textShadow: `
      0 1px 0 #FFFF99,
      0 2px 1px rgba(0,0,0,0.3),
      0 4px 8px rgba(255,215,0,0.6)
    `,
    filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.5))',
  },
  platinum: {
    color: '#E5E4E2', // Platinum color for the star
    textShadow: `
      0 1px 0 #FFFFFF,
      0 2px 1px rgba(0,0,0,0.2),
      0 4px 8px rgba(229,228,226,0.6)
    `,
    filter: 'drop-shadow(0 2px 4px rgba(229,228,226,0.5))',
  },
};

const StarWrapper = ({ children, starType, count }) => (
  <Tooltip
    title={
      <Box sx={{ textAlign: 'center', p: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
          {starType.charAt(0).toUpperCase() + starType.slice(1)} Stars: {count}
        </Typography>
      </Box>
    }
    placement="top"
    arrow
    sx={{
      '& .MuiTooltip-tooltip': {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        fontSize: '0.7rem',
        borderRadius: '6px',
        backdropFilter: 'blur(8px)',
        py: 0.5,
        px: 1,
      },
      '& .MuiTooltip-arrow': {
        color: 'rgba(0, 0, 0, 0.8)',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.3,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `${floatAnimation} 3s ease-in-out infinite`,
        animationDelay: starType === 'gold' ? '0.5s' : starType === 'platinum' ? '1s' : '0s',
        '&:hover': {
          transform: 'scale(1.1) translateY(-4px)',
          '& .star-3d-container .main-star': {
            animation: `${spinAnimation} 0.8s ease-in-out infinite`,
          },
          '& .star-name': {
            color: starType === 'silver' ? '#C0C0C0' : starType === 'gold' ? '#FFD700' : '#E5E4E2',
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {children}
    </Box>
  </Tooltip>
);

const Enhanced3DStar = ({ type }) => (
  <Box
    className="star-3d-container"
    sx={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32, // 🔥 SMALLER SIZE (was 50px)
      height: 32,
      borderRadius: '50%',
      // 🔥 BLACK CIRCULAR BACKGROUND - ONLY for the star circle
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.15)',
      boxShadow: `
        0 2px 8px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.1),
        inset 0 -1px 0 rgba(0,0,0,0.5)
      `,
      overflow: 'visible',
      '&:hover .shine-effect': {
        animation: `${shineAnimation} 1.2s ease-in-out`,
      },
    }}
  >
    {/* Main 3D Star with SOLID COLOR */}
    <StarIcon
      className="main-star"
      sx={{
        fontSize: 20, // 🔥 SMALLER STAR SIZE (was 28px)
        color: star3DStyles[type].color,
        textShadow: star3DStyles[type].textShadow,
        filter: star3DStyles[type].filter,
        position: 'relative',
        zIndex: 3,
        transition: 'all 0.3s ease',
        transform: 'perspective(100px) rotateX(15deg)',
        transformOrigin: 'center center',
      }}
    />

    {/* Shine overlay effect */}
    <Box
      className="shine-effect"
      sx={{
        position: 'absolute',
        top: '-8px',
        left: '-100%',
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
        transform: 'skewX(-25deg)',
        zIndex: 4,
        pointerEvents: 'none',
      }}
    />

    {/* Subtle outer glow */}
    <Box
      sx={{
        position: 'absolute',
        inset: '-4px',
        background: `radial-gradient(circle, ${
          type === 'silver'
            ? 'rgba(192,192,192,0.2)'
            : type === 'gold'
            ? 'rgba(255,215,0,0.2)'
            : 'rgba(229,228,226,0.2)'
        } 0%, transparent 50%)`,
        borderRadius: '50%',
        zIndex: 0,
        animation: `${pulseAnimation} 2s ease-in-out infinite`,
      }}
    />
  </Box>
);

const EmployeeStars = ({ silver = 0, gold = 0, platinum = 0 }) => (
  <Box
    className="stars-3d-container"
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // 🔥 CENTER aligned for compact layout
      gap: 1.5, // 🔥 SMALLER GAP (was 3)
      mt: 1, // 🔥 SMALLER MARGINS
      mb: 0.5,
      padding: '8px 12px', // 🔥 SMALLER PADDING
      borderRadius: '12px', // 🔥 SMALLER RADIUS
      // 🔥 ORIGINAL LIGHT BACKGROUND - keeping as before
      background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.6) 100%)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.3)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)', // 🔥 SOFTER SHADOW
    }}
  >
    <StarWrapper starType="silver" count={silver}>
      <Enhanced3DStar type="silver" />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        {/* Smaller star name */}
        <Typography
          className="star-name"
          variant="caption"
          sx={{
            color: '#666666',
            fontWeight: 600,
            fontSize: '0.6rem', // 🔥 SMALLER FONT SIZE
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            transition: 'all 0.3s ease',
          }}
        >
          Silver
        </Typography>
        {/* Smaller count */}
        <Typography
          sx={{
            color: '#C0C0C0',
            fontWeight: 700,
            fontSize: '0.9rem', // 🔥 SMALLER COUNT SIZE
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          {silver}
        </Typography>
      </Box>
    </StarWrapper>

    <StarWrapper starType="gold" count={gold}>
      <Enhanced3DStar type="gold" />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <Typography
          className="star-name"
          variant="caption"
          sx={{
            color: '#666666',
            fontWeight: 600,
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            transition: 'all 0.3s ease',
          }}
        >
          Gold
        </Typography>
        <Typography
          sx={{
            color: '#FFD700',
            fontWeight: 700,
            fontSize: '0.9rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          {gold}
        </Typography>
      </Box>
    </StarWrapper>

    <StarWrapper starType="platinum" count={platinum}>
      <Enhanced3DStar type="platinum" />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <Typography
          className="star-name"
          variant="caption"
          sx={{
            color: '#666666',
            fontWeight: 600,
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            transition: 'all 0.3s ease',
          }}
        >
          Platinum
        </Typography>
        <Typography
          sx={{
            color: '#E5E4E2',
            fontWeight: 700,
            fontSize: '0.9rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          {platinum}
        </Typography>
      </Box>
    </StarWrapper>
  </Box>
);

export default EmployeeStars;
