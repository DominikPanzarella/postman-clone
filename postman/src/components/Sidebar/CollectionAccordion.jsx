import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Grid2 } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RequestCard from './RequestCard';

const CollectionAccordion = ({ 
  collection, 
  expanded, 
  onChange, 
  onExport, 
  requests, 
  onRequestClick,
  classes 
}) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onChange}
      sx={{
        backgroundColor: expanded ? "#f5f5f5" : "white",
        transition: "background-color 0.3s ease"
      }}
    >
      <AccordionSummary
        component="div"
        expandIcon={<ExpandMore />}
        aria-controls={`panel-${collection.id}-content`}
        id={`panel-${collection.id}-header`}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="body1">{collection.name}</Typography>
          <Button
            className={classes.button}
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onExport();
            }}
          >
            Export
          </Button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container direction="column" spacing={2}>
          {requests.map((request) => (
            <Grid2 item key={request.id}>
              <RequestCard request={request} onClick={() => onRequestClick(request)} />
            </Grid2>
          ))}
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollectionAccordion;