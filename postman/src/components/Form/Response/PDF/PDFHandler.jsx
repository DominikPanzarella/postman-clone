import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';

const useStyles = makeStyles({
  container: {
    marginTop: 20,
    padding: 16,
    maxHeight: 'calc(100vh - 80px)', // Prevent overflow of the entire component
    overflow: 'auto',
  },
  pdfFrame: {
    border: 'none',
    width: '100%',
    height: '600px',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

const PDFHandler = ({ apiResponse }) => {
  const classes = useStyles();
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (apiResponse) {
      convertPDF();
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [apiResponse]);

  const convertPDF = () => {
    const headers = apiResponse.data.headers || '';
    const contentTypeArray = headers['Content-Type'] || '';
    const contentTypeHeader = contentTypeArray[0];

    let pdfContent = apiResponse.data.body; 

    if (!pdfContent) {
      console.error('No image content in the API response');
      return;
    }

    try {

      const byteCharacters = atob(pdfContent);

      var byteArray = new ArrayBuffer(byteCharacters.length);
      var integerArray = new Uint8Array(byteArray);

      for (let i = 0; i < byteCharacters.length; i++) {
        integerArray[i] = byteCharacters.charCodeAt(i);
      }
      
      const blob = new Blob([integerArray], { type: contentTypeHeader });
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);
      
    } catch (error) {
      console.error('Error converting image:', error);
    }
  };

  return (
    <Box className={classes.container}>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          className={classes.pdfFrame}
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </Box>
  );
};

export default PDFHandler;
