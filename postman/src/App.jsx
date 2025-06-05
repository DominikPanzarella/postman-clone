import PostmanWrapper from './components/PostmanWrapper/PostmanWrapper';
import React, { useState } from 'react';
import { Box, TextField, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

function App() {
    const [config, setConfig] = useState({
        url: 'https://supsi-ticket.cloudns.org/supsi-http-client/bff',
        search: true,
        collections: true,
        responseHandler: 'alertStatus'
    });

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const responseHandlers = {
        alertStatus: (response) => alert("Response Status: " + response.status),
        logResponse: (response) => console.log("Full Response:", response),
        download: (response) => downloadResponseAsJSON(response)
    };

    const downloadResponseAsJSON = (response) => {
        const jsonString = JSON.stringify(response, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'response.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 4 }}>
            {/* Pannello di configurazione */}
            <Box sx={{ 
                maxWidth: 600, 
                width: '100%', 
                padding: 3, 
                borderRadius: 2, 
                boxShadow: 3, 
                bgcolor: 'background.paper' 
            }}>
                <Typography variant="h5" gutterBottom>
                    Configure PostmanWrapper
                </Typography>

                <TextField
                    label="API URL"
                    variant="outlined"
                    name="url"
                    value={config.url}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <FormControlLabel
                    control={<Checkbox checked={config.search} onChange={handleChange} name="search" />}
                    label="Enable Search bar"
                />
                <FormControlLabel
                    control={<Checkbox checked={config.collections} onChange={handleChange} name="collections" />}
                    label="Enable Sidebar with Collections"
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Action on Response Click</InputLabel>
                    <Select
                        label="Acrion on Response Click"
                        name="responseHandler"
                        value={config.responseHandler}
                        onChange={handleChange}
                    >
                        <MenuItem value="alertStatus">Show alert with the status code</MenuItem>
                        <MenuItem value="logResponse">Log the response in console</MenuItem>
                        <MenuItem value="download">Download the response in JSON</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Componenti generati dinamicamente */}
            <Box sx={{ mt: 4, width: '100%' }}>
                <PostmanWrapper
                    url={config.url}
                    search={config.search}
                    collections={config.collections}
                    onResponseMessageClick={responseHandlers[config.responseHandler]}
                />
            </Box>
        </Box>
    );
}

export default App;