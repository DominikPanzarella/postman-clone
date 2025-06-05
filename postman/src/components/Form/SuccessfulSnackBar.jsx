import { Snackbar, Alert, Slide } from "@mui/material";
import * as React from 'react';

// Slide transition component
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

const SuccessfulSnackBar = ({ message, open, setOpen }) => {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return; // Prevent accidental closure
        setOpen(false); // Close the snackbar
    };

    return (
        
        <Snackbar
            open={open} 
            onClose={handleClose}
            TransitionComponent={SlideTransition} 
            autoHideDuration={2000} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Positioning
        >
            <Alert 
                onClose={handleClose} 
                severity="success" 
                sx={{ width: '100%' }}
            >
                {message} 
            </Alert>
        </Snackbar>
    );
};

export default SuccessfulSnackBar;
