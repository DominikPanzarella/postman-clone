import { Snackbar, Alert, Slide } from "@mui/material";
import * as React from 'react';

// Slide transition component
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const SnackBar = ({ errorMsg, error, setError }) => {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return; // Prevent accidental closure
        setError(false); // Close the snackbar
    };

    return (
        <Snackbar
            open={error} 
            onClose={handleClose}
            TransitionComponent={SlideTransition} 
            autoHideDuration={2000} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Positioning
        >
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {errorMsg}
            </Alert>
        </Snackbar>
    );
};

export default SnackBar;
