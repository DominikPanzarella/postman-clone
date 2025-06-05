import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Import ContentCopyIcon

const useStyles = makeStyles({
    container: {
        marginTop: 20,
        padding: 16,
        maxHeight: 'calc(100vh - 80px)',
        overflow: 'auto',
    },
    preContainer: {
        position: 'relative',
        marginTop: 16,
        maxHeight: '100%',
        overflow: 'auto',
        backgroundColor: '#f8f8f8', // add background color
        border: '1px solid #ccc',
        padding: 10,
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
    },
    copyButton: {
        position: 'absolute',
        top: 8,
        right: 8
    },
});

const JSONPreview = ({ responseData }) => {
    const classes = useStyles();

    const decodedData = atob(responseData);
    const jsonData = JSON.parse(decodedData);
    const json = JSON.stringify(jsonData, null,2);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Box className={classes.preContainer}>
            <Typography component="pre" variant="body2">
                {json}
            </Typography>
            <Tooltip title="Copia negli appunti" className={classes.copyButton}>
                <IconButton
                    size="small"
                    onClick={() => copyToClipboard(json)}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default JSONPreview;