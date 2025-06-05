import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '300px', // Adjust as needed
        width: '100%',
    },
    errorIcon: {
        fontSize: '60px', // Bigger icon
        color: '#d32f2f', // Red warning color
        marginBottom: '10px',
    },
    message: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#d32f2f',
    },
    subText: {
        fontSize: '14px',
        color: '#757575', // Gray color
    }
});

const ErrorScreen = () => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            <ErrorOutlineIcon className={classes.errorIcon} />
            <Typography className={classes.message}>Oops! Something went wrong.</Typography>
            <Typography className={classes.subText}>Please check the request and try again.</Typography>
        </Box>
    );
};

export default ErrorScreen;
