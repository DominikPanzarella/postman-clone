import { Box, Typography, Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';
import image from '../../../assets/no-response.png';
const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white', 
        borderRadius: '10px', 
        padding: '20px',
    },
    image: {
        width: '15%', 
        opacity: 0.8,
    },
    message: {
        fontSize: '18px',
        fontWeight: 500,
        color: '#616161', 
        marginTop: '15px',
    }
});

const DefaultHandler = ({apiResponse}) => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            

            <img src={image} alt="No Response" className={classes.image} />

            <Typography className={classes.message}>
                Unable to process the resposne.
            </Typography>
        </Box>
    );

};

export default DefaultHandler;