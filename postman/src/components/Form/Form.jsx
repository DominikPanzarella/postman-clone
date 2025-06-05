
import {useContext, useEffect } from 'react';
import { useState } from 'react';
import { Select, MenuItem, TextField, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { DataContext } from '../context/DataProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddIcon from '@mui/icons-material/Add';
const useStyles = makeStyles({
    component: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    select: {
        width: 150,
        height: 40
    },
    button: {
        width: 100,
        height: 40,
        marginLeft: '5px !important'
    },
    textfield: {
        width: '100%',
        background: '#F6F6F6'
    }
});


const Form = ({onSendClick,showSnackbar, setError,setSuccess}) => {

    const classes = useStyles();
    const [requestType, setRequestType] = useState('POST');

    const { 
        formData, setFormData, 
        paramData, setParamData, 
        headerData, setHeaderData, 
        jsonText, setJsonText, 
        dirty, setDirty, 
        currentRequest, setCurrentRequest, 
        currentCollection, setCurrentCollection 
    } = useContext(DataContext);
    

    {/*
    useEffect(() => {
        console.log("Updated formData:", formData);
    }, [formData]);
    */}

    const getColor = (type) => {
        switch (type) {
            case 'POST':
                return { button: 'primary', select: '#1976d2' }; // Blue
            case 'GET':
                return { button: 'success', select: '#2e7d32' }; // Green
            case 'PUT':
                return { button: 'warning', select: '#ed6c02' }; // Orange
            case 'DELETE':
                return { button: 'error', select: '#d32f2f' }; // Red
            default:
                return { button: 'primary', select: '#1976d2' };
        }
    };


    const onUrlChange = (e) => {
        setFormData({ ...formData, url: e.target.value });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, type: e.target.value });
    }

    const onDeleteClick = async () => {
        const apiKey='spapanz1';

        let url = 'https://supsi-ticket.cloudns.org/supsi-http-client/bff/requests/'+currentRequest.id+`?apiKey=${apiKey}`;
        let method = "DELETE";         
        let collectionId = currentCollection && Number(currentCollection) > 0 ? currentCollection : 1;

        if (!currentRequest || Object.keys(currentRequest).length === 0) {
            console.error("Nessuna richiesta esistente selezionata");
            setError(true);
            showSnackbar("Nessuna richiesta esistente selezionata", "error");
        } else{
            try {
                const response = await fetch(url, {
                    method: method
                });
    
                if (!response.ok) {
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
        
                const result = await response;
                
                setDirty(dirty+1);

                //setCurrentRequest(undefined);               
                // Resetta i dati associati alla richiesta eliminata
                setParamData([]);
                setHeaderData([]);
                formData.url = '';
                setJsonText('');
                setError(false);
                setSuccess(true);
                showSnackbar("Operazione completata con successo!");
            } catch (error) {
                console.error("Errore durante la richiesta:", error);
                setError(true);
                setSuccess(false);
                showSnackbar("Errore durante la richiesta.");
            }
        }
    }

    const onSaveClick = async () => {
        const apiKey='spapanz1';

        let url = 'https://supsi-ticket.cloudns.org/supsi-http-client/bff/requests/'+currentRequest.id+`?apiKey=${apiKey}`;
        let method = "PUT"; 
        let collectionId = currentCollection && Number(currentCollection) > 0 ? currentCollection : 1;
        
        const headersObj = headerData.reduce((acc, header) => {
            // Verifica se il valore è già un array
            if (Array.isArray(header.value)) {
                acc[header.key] = header.value; // Se è già un array, lascialo così
            } else {
                acc[header.key] = [header.value]; // Altrimenti, mettilo in un array
            }
            return acc;
        }, {});

        let requestBody = {
            name: currentRequest.name || 'unknown', // Nome della richiesta
            uri: formData.url, // URL dal form
            method: formData.type, // Tipo di richiesta (POST, GET, etc.)
            headers: headersObj, // Intestazioni correttamente formattate come array
            body: jsonText, // Il corpo JSON dell'utente
            collectionId: collectionId, // ID della collezione
        };

        if (!currentRequest || Object.keys(currentRequest).length === 0 || currentRequest.id == undefined) {
            url = 'https://supsi-ticket.cloudns.org/supsi-http-client/bff/collections/'+collectionId+'/requests'+`?apiKey=${apiKey}`;
            method = "POST"; 
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`Errore HTTP: ${response.status}`);
            }
    
            const result = await response.json();
            setDirty(dirty+1);
            setError(false);
            setSuccess(true);
            showSnackbar("Operazione completata con successo!");
        } catch (error) {
            setError(true);
            setSuccess(false);
            console.error("Errore durante la richiesta:", error);
            showSnackbar("Errore durante la richiesta.");
        }
    };

    const onNameChange = (e) => {
        const newName = e.target.value;
        setCurrentRequest(prev => prev ? { ...prev, name: newName } : { name: newName });
    };

    return (
        <Box>
        <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end'} }>
                <DriveFileRenameOutlineIcon sx={{ color: '#1976d2', mr: 1, my: 0.5, fontSize: '40px'}} />
                <TextField id="input-with-sx" 
                label="Request's name" 
                variant="standard" 
                className={classes.nameField}
                value={currentRequest.name || ''}
                onChange={onNameChange}
                 />
            </Box>

            <Box sx={{ paddingBottom: 0 }}>
                {currentCollection && Number(currentCollection) > 0 && Number(currentCollection) <= 3 && currentCollection != undefined && (
                        <>
                            {currentRequest.id && (
                                <Button
                                className={classes.button}
                                variant="outlined"
                                startIcon={<SaveAltIcon />}
                                onClick= {() => onSaveClick()}
                                >
                                Save
                                </Button>
                            )}
                            {!currentRequest.id && (
                                <Button
                                className={classes.button}
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick= {() => onSaveClick()}
                                >
                                Create
                                </Button>
                            )}
                            {currentRequest.id && (
                            <>
                                <Button
                                    className={classes.button}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick= {() => onDeleteClick()}
                                    >
                                    Delete
                                </Button> 
                            </>)}
                        </>
                    )
                    } 
            </Box>
            </Box>
            <Box className={classes.component}>
                <Select
                    className={classes.select}
                    value={formData.type}
                    onChange={handleChange}
                    sx={{
                        backgroundColor: getColor(formData.type).select,
                        color: '#FFF', // White text for contrast
                        '& .MuiSvgIcon-root': {
                            color: '#FFF' // Ensures the dropdown arrow remains visible
                        }
                    }}
                >
                    <MenuItem value={'POST'}>POST</MenuItem>
                    <MenuItem value={'GET'}>GET</MenuItem>
                    <MenuItem value={'PUT'}>PUT</MenuItem>
                    <MenuItem value={'DELETE'}>DELETE</MenuItem>
                </Select>
                <TextField 
                    size="small"
                    className={classes.textfield} 
                    value={formData.url}
                    onChange={(e) => onUrlChange(e)}
                    
                />
                <Stack direction="row" spacing={2}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color={getColor(formData.type).button}
                        endIcon={<SendIcon />}
                        onClick = {() => onSendClick()}
                    >
                        Send
                    </Button>
                </Stack>
            </Box>

        </Box>
    );
};

export default Form;
