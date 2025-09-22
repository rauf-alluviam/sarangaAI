import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import {
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { blue, green, grey, purple } from '@mui/material/colors';
import EmployeeStars from './components/EmployeeStars';

// Styled components for modern look
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    '& .avatar-container': {
      transform: 'scale(1.05)',
    },
    '& .card-content': {
      background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
    },
  },
}));

const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)',
    animation: 'rotate 20s linear infinite',
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 0),
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(103, 126, 234, 0.05)',
    transform: 'translateX(4px)',
  },
}));

const EmployeeCard = ({ employee, onClick }) => {
  const { avatar, fullName, phone, department, designation, userId, inductionCompleted } = employee;

  const isDocument = /\.(docx?|pdf|txt)$/i.test(avatar || '');

  // Generate gradient colors based on user initials
  const getGradientColor = (name) => {
    const colors = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
      ['#a8edea', '#fed6e3'],
      ['#ff9a9e', '#fecfef'],
      ['#ffecd2', '#fcb69f'],
    ];
    const index = name.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]} 0%, ${colors[index][1]} 100%)`;
  };

  return (
    <StyledCard onClick={onClick}>
      {/* Header with gradient background */}
      <GradientBackground
        sx={{
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          position: 'relative',
        }}
      >
        {/* Induction completed badge */}
        {inductionCompleted && (
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
            label="Induction Completed"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
              zIndex: 10,
              '& .MuiChip-icon': {
                color: 'white',
              },
            }}
          />
        )}

        {/* Left side - Avatar */}
        <Box className="avatar-container" sx={{ transition: 'transform 0.3s ease' }}>
          <Avatar
            src={avatar && !isDocument ? avatar : undefined}
            alt={fullName}
            sx={{
              width: 80,
              height: 80,
              background: !avatar || isDocument ? getGradientColor(fullName) : 'transparent',
              fontSize: '2rem',
              fontWeight: 600,
              border: '4px solid rgba(255,255,255,0.9)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            {!avatar || isDocument ? fullName.charAt(0).toUpperCase() : ''}
          </Avatar>
        </Box>

        {/* Right side - Stars */}
        <Box
          sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '12px',
            padding: '6px 8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <EmployeeStars
            silver={employee?.employee_stars?.silver_count || 0}
            gold={employee?.employee_stars?.gold_count || 0}
            platinum={employee?.employee_stars?.platinum_count || 0}
          />
        </Box>
      </GradientBackground>

      {/* Content section */}
      <CardContent
        className="card-content"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'background 0.3s ease',
        }}
      >
        {/* Name */}
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{
            fontWeight: 700,
            color: '#1a202c',
            mb: 2,
            fontSize: '1.25rem',
            lineHeight: 1.3,
          }}
        >
          {fullName}
        </Typography>

        {/* Info rows with icons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <InfoRow>
            <BadgeIcon sx={{ fontSize: 18, color: purple[500] }} />
            <Typography variant="body2" sx={{ color: grey[600], fontWeight: 500 }}>
              {userId}
            </Typography>
          </InfoRow>

          <InfoRow>
            <BusinessIcon sx={{ fontSize: 18, color: blue[500] }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: grey[800], fontWeight: 600, lineHeight: 1.2 }}
              >
                {designation}
              </Typography>
              <Typography variant="caption" sx={{ color: grey[500] }}>
                {department}
              </Typography>
            </Box>
          </InfoRow>

          <InfoRow>
            <PhoneIcon sx={{ fontSize: 18, color: green[500] }} />
            <Typography variant="body2" sx={{ color: grey[600], fontWeight: 500 }}>
              {phone}
            </Typography>
          </InfoRow>
        </Box>

        {/* Action hint */}
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: '1px solid rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: grey[500],
              fontWeight: 500,
              opacity: 0.7,
              transition: 'opacity 0.3s ease',
              '.MuiCard-root:hover &': {
                opacity: 1,
              },
            }}
          >
            Click to view details →
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default EmployeeCard;
