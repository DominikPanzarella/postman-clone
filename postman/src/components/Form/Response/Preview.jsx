import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { ApiRounded, SettingsEthernetRounded } from '@mui/icons-material';
import ErrorScreen from '../ErrorScreen';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
    padding: 16,
    maxHeight: 'calc(100vh - 80px)', // Prevent overflow of the entire component
    overflow: 'auto',
  },
  preContainer: {
    position: 'relative',
    marginTop: 16,
    maxHeight: '100%', // Ensure content inside doesn't overflow
    overflow: 'auto',
  },
  pre: {
    margin: 0,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'auto',
    maxHeight: '400px', // Make sure the content doesn't overflow
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#bdbdbd',
      borderRadius: '4px',
    }
  },
  pdfFrame: {
    border: 'none',
    width: '100%',
    height: '600px',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  htmlFrame: {
    border: 'none',
    width: '100%',
    maxHeight: 'calc(100vh - 80px)', // Ensure it doesn't overflow beyond the viewport height
    overflow: 'disable', // Allow scrolling if necessary
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    overflow: 'hidden', // Prevent image from overflowing
  },
  image: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain', // Ensures the image fits within the container without stretching
  },
  copyButton: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  errorContainer: {
    padding: 24,
    textAlign: 'center'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  },
  codeButton: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  errorMessage: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginBottom: 8
  }
});

const Preview = ({ response }) => {
  const classes = useStyles();
  const [contentType, setContentType] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [viewMode, setViewMode] = useState('auto'); // auto, json, html, image, raw, txt, xml, csv
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [iframeUrl, setIframeUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (!response) {
      setContentType('');
      setResponseData(null);
      setViewMode('auto');
      setError(null);
      return;
    }

    const processResponse = async () => {
      try {
        setError(null);

        if (response.error) {
          setError(response.message || 'Si è verificato un errore');
          return;
        }

        const headers = response.data.headers || '';
        const contentTypeArray = headers['Content-Type'] || '';
        const contentTypeHeader = contentTypeArray[0];
        
        setContentType(contentTypeHeader);

        let data = response.data.body;
        setResponseData(data);

        if (contentTypeHeader.includes('json') || typeof data === 'object') {
          setViewMode('json');
        } else if (contentTypeHeader.includes('text/html') || (typeof data === 'string' && data.trim().startsWith('<'))) {

          setViewMode('html');
          const htmlContent = response.data.body;
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const blobUrl = URL.createObjectURL(blob);
          setIframeUrl(blobUrl);

        } else if (contentTypeHeader.includes('image/')) {

          const imageContent = response.data.body;  
          let byteArray = new Uint8Array(imageContent.length);
          for (let i = 0; i < imageContent.length; i++) {
            byteArray[i] = imageContent.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: contentTypeHeader });
          const blobUrl = URL.createObjectURL(blob);
          setImageUrl(blobUrl);
          setViewMode('image');
        } 
        else if (contentTypeHeader.includes('application/pdf')) {
          const pdfContent = response.data.body;  
          let byteArray = new Uint8Array(pdfContent.length);
          for (let i = 0; i < pdfContent.length; i++) {
            byteArray[i] = pdfContent.charCodeAt(i);
          }
          const blob = new Blob([byteArray], { type: contentTypeHeader });
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl);
          setViewMode('pdf');
        }
        else if (contentTypeHeader.includes('text/plain')) {
          setViewMode('txt');
        } else if (contentTypeHeader.includes('application/xml') || contentTypeHeader.includes('text/xml')) {
          setViewMode('xml');
        } else if (contentTypeHeader.includes('text/csv')) {
          setViewMode('csv');
        } else {
          setViewMode('raw');
        }
      } catch (err) {
        console.error('Errore nell\'elaborazione della risposta:', err);
        setError('Errore durante l\'elaborazione della risposta');
      }
    }

    processResponse();

  }, [response]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text)
      .then(() => alert('Copiato negli appunti!'))
      .catch(err => console.error('Errore durante la copia:', err));
  };

  const renderContent = () => {
    if (!responseData) {
      return (
        <Typography variant="body1" color="textSecondary">
          Nessun dato disponibile
        </Typography>
      );
    }
    switch (viewMode) {
      case 'json': {
        const jsonData = typeof responseData === 'string' && responseData.trim().startsWith('{')
          ? JSON.parse(responseData)
          : responseData;
    
        return (
          <Box className={classes.preContainer}>
            <Box
                className={classes.div}
                dangerouslySetInnerHTML={{ __html: jsonData }}
            />
            <Tooltip title="Copia negli appunti" className={classes.copyButton}>
              <IconButton 
                size="small" 
                onClick={() => copyToClipboard(jsonData)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
      case 'html':
        console.log(response.data.body);
        return (
          <Box className={classes.container}>
            <iframe 
              src={iframeUrl} 
              title="HTML Preview" 
              className={classes.htmlFrame}
              sandbox="allow-scripts"
              style={{ width: '100%', height: '100vh' }}
            />
            <Box className={classes.codeButton}>
              <Tooltip title="Visualizza codice HTML">
                <IconButton 
                  onClick={() => setViewMode('raw')}
                  size="small"
                >
                  <CodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      case 'image':
        return (
          <Box className={classes.container}>
              <Box className={classes.imageContainer}>
                <img src={imageUrl} alt="Image Preview" className={classes.image} />
              </Box>
          </Box>
        );
      case 'txt':
        return (
          <Box className={classes.container}>
            <Box className={classes.preContainer}>
              <pre className={classes.pre}>
                {String(responseData)}
              </pre>
              <Tooltip title="Copia negli appunti" className={classes.copyButton}>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(responseData)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      case 'xml':
        const xmlData = typeof responseData === 'string' ? responseData : String(responseData);
        return (
          <Box className={classes.container}>
            <Box className={classes.preContainer}>
              <pre className={classes.pre}>
                {xmlData}
              </pre>
              <Tooltip title="Copia negli appunti" className={classes.copyButton}>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(xmlData)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      case 'csv':
        const csvData = typeof responseData === 'string' ? responseData : String(responseData);
        return (
          <Box className={classes.container}>
            <Box className={classes.preContainer}>
              <pre className={classes.pre}>
                {csvData}
              </pre>
              <Tooltip title="Copia negli appunti" className={classes.copyButton}>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(csvData)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
        case 'pdf':
          //TODO
          return (
            <Box className={classes.container}>
              <iframe src={pdfUrl} title="PDF Preview" className={classes.pdfFrame} />
            </Box>
          );
      case 'raw':
      default:
        return (
          <Box className={classes.container}>
            <Box className={classes.preContainer}>
              <pre className={classes.pre}>
                {typeof responseData === 'object' 
                  ? JSON.stringify(responseData, null, 2) 
                  : String(responseData)}
              </pre>
              <Tooltip title="Copia negli appunti" className={classes.copyButton}>
                <IconButton 
                  size="small" 
                  onClick={() => copyToClipboard(responseData)}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {viewMode === 'raw' && contentType.includes('text/html') && (
                <Box className={classes.codeButton}>
                  <Tooltip title="Visualizza HTML renderizzato">
                    <IconButton 
                      onClick={() => setViewMode('html')}
                      size="small"
                    >
                      <DataObjectIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        );
    }
  };

  if (error) {
    return (
      <Box className={classes.container}>
        <Box className={classes.errorContainer}>
          <Typography className={classes.errorMessage} variant="h6">
            Si è verificato un errore
          </Typography>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" className={classes.container}>
      {renderContent()}
    </Paper>
  );
};

export default Preview;
