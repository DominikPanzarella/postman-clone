import React from 'react';
import { Accordion, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CollectionAccordion from './CollectionAccordion';

const CollectionList = ({ 
  collectionsList, 
  expandedCollection, 
  handleAccordionChange, 
  handleExport, 
  handleImport,
  filteredRequests, 
  handleCardClick,
  classes 
}) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Typography variant="h6">Collections</Typography>
        <Button
          className={classes.button}
          variant="outlined"
          startIcon={<FileUploadIcon />}
          onClick={() => handleImport()}
        >
          Import
        </Button>
      </div>
      
      {collectionsList.map((collection) => (
        <CollectionAccordion
          key={collection.id}
          collection={collection}
          expanded={expandedCollection === collection.id}
          onChange={handleAccordionChange(collection.id)}
          onExport={() => handleExport(collection)}
          requests={filteredRequests[collection.id] || []}
          onRequestClick={handleCardClick}
          classes={classes}
        />
      ))}
    </>
  );
};

export default CollectionList;