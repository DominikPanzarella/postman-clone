import React from 'react';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';

const RequestCard = ({ request, onClick }) => {
  const getColor = (type) => {
    switch (type) {
      case 'POST':
        return { button: 'primary', select: '#1976d2' }; // Blue
      case 'GET':
        return { button: 'success', select: '#2e7d32' }; // Green
      case 'PUT':
        return { button: 'warning', select: '#ed6c02' }; // Orange
      case 'DELETE':
        return { button: 'error', select: '#d32f2f' }; // Red
      default:
        return { button: 'primary', select: '#1976d2' };
    }
  };

  const trimName = (name) => {
    if (name.length > 15) {
      return name.substring(0, 10) + "...";
    } else {
      return name;
    }
  };

  return (
    <Card sx={{ marginBottom: '10px', cursor: 'pointer' }} onClick={onClick}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ textWrapMode: 'nowrap' }}>
            <strong style={{ color: getColor(request.method).select }}>{request.method}</strong> | {trimName(request.name)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RequestCard;