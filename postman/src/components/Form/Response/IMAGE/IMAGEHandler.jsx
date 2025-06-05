import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

// Note: We're removing the makeStyles import since we'll use inline styles
// You mentioned base64-js but it's not needed for the conversion we're doing

const IMAGEHandler = ({ apiResponse }) => {
  const [imageUrl, setImageUrl] = useState('');
  
  // Styles as regular objects instead of makeStyles
  const styles = {
    container: {
      marginTop: 20,
      padding: 16,
      maxHeight: 'calc(100vh - 80px)',
      overflow: 'auto',
    },
    imageContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: 16,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 'auto',
      display: 'block',
    },
  };

  useEffect(() => {
    if (apiResponse) {
      convertImage();
    }
    
    // Clean up function to revoke object URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [apiResponse]);


  const convertImage = () => {
    if (!apiResponse || !apiResponse.data) {
      console.error('Invalid API response');
      return;
    }

    // Get the content type from headers
    const headers = apiResponse.data.headers || {};
    const contentTypeArray = headers['Content-Type'] || [];
    const contentTypeHeader = contentTypeArray[0] || 'image/jpeg'; 
    
    // Get the binary content
    const imageContent = apiResponse.data.body;
    
    if (!imageContent) {
      console.error('No image content in the API response');
      return;
    }

    try {

      const byteCharacters = atob(imageContent);

      var byteArray = new ArrayBuffer(byteCharacters.length);
      var integerArray = new Uint8Array(byteArray);

      for (let i = 0; i < byteCharacters.length; i++) {
        integerArray[i] = byteCharacters.charCodeAt(i);
      }
      
      const blob = new Blob([integerArray], { type: contentTypeHeader });
      const blobUrl = URL.createObjectURL(blob);
      setImageUrl(blobUrl);
      
    } catch (error) {
      console.error('Error converting image:', error);
    }
  };

  return (
    <Box sx={styles.container}>
      {imageUrl ? (
        <div style={styles.imageContainer}>
          <img src={imageUrl} alt="Preview Image" style={styles.image} />
        </div>
      ) : (
        <p>Loading Image...</p>
      )}
    </Box>
  );
};

export default IMAGEHandler;