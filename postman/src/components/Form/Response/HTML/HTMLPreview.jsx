import { useState, useEffect } from 'react';
import { Box, Tooltip, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CodeIcon from '@mui/icons-material/Code'; // Import CodeIcon

const useStyles = makeStyles({
    container: {
        position: 'relative',
        height: '100vh', // Or adjust as needed
    },
    htmlFrame: {
        width: '100%',
        height: 'calc(100% - 40px)', // Adjust for button height
        border: 'none',
    },
    codeButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
});

const HTMLPreview = ({ apiResponse, setViewMode }) => { // Add setViewMode as a prop
    const classes = useStyles();
    const [iframeUrl, setIFrameUrl] = useState('');

    useEffect(() => {
        if (apiResponse && apiResponse.data && apiResponse.data.body) {
            transformURL();
        }
        return () => {
          if (iframeUrl) {
            URL.revokeObjectURL(iframeUrl);
          }
        };
    }, [apiResponse]);

    const transformURL = () => {
        const htmlContent = atob(apiResponse.data.body);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        setIFrameUrl(blobUrl);
    };

    return (
        <Box className={classes.container}>
            <iframe
                src={iframeUrl}
                title="HTML Preview"
                className={classes.htmlFrame}
                sandbox="allow-scripts"
                style={{ width: '100%', height: '100%' }}
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
};

export default HTMLPreview;