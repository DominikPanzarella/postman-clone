import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  preContainer: {
    padding: 16,
    border: '1px solid #ccc',
    backgroundColor: '#f8f8f8',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
    maxHeight: 'calc(100vh - 120px)', // Adjust as needed
  },
});

const HTMLResponse = ({ apiResponse }) => {
  const classes = useStyles();

  if (!apiResponse || !apiResponse.data || !apiResponse.data.body) {
    return (
      <Box>
        <Typography variant="body1" color="textSecondary">
          No HTML content available.
        </Typography>
      </Box>
    );
  }

  const htmlString = atob(apiResponse.data.body);

  return (
    <Box className={classes.preContainer}>
      <Typography component="pre" variant="body2">
        {htmlString}
      </Typography>
    </Box>
  );
};

export default HTMLResponse;