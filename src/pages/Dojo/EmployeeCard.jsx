import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { blue } from '@mui/material/colors';

const EmployeeCard = ({ employee, onClick }) => {
  const { avatar, fullName, phone, department, designation, userId, inductionCompleted } = employee;

  const isDocument = /\.(docx?|pdf|txt)$/i.test(avatar || '');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3,
          cursor: 'pointer',
        },
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="div"
          sx={{
            height: 140,
            backgroundColor: blue[100],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {avatar ? (
            isDocument ? (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: blue[500],
                  fontSize: '2rem',
                }}
              >
                {fullName.charAt(0)}
              </Avatar>
            ) : (
              <Box
                component="img"
                sx={{
                  height: 100,
                  width: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${blue[500]}`,
                  boxShadow: 3,
                }}
                src={avatar}
                alt={fullName}
              />
            )
          ) : (
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: blue[500],
                fontSize: '2rem',
              }}
            >
              {fullName.charAt(0)}
            </Avatar>
          )}
        </CardMedia>

        {inductionCompleted && (
          <Chip
            label="Induction Completed"
            color="success"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontWeight: 'bold',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" align="center">
          {fullName}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            mt: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>ID:</strong> {userId}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Role:</strong> {designation}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Department:</strong> {department}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Phone:</strong> {phone}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
