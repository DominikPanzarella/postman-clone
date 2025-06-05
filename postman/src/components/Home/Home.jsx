import React, { useContext, useState } from 'react';
import Header from '../Header/Header';
import Form from '../Form/Form';
import { Box } from '@mui/material';
import SelectTab from '../Form/SelectTab/SelectTab';
import { DataContext } from '../context/DataProvider';
import { checkParams } from '../../utils/common-utils';
import { getData } from '../../../service/api';
import SnackBar from '../Form/SnackBar';
import SuccessfulSnackBar from '../Form/SuccessfulSnackBar';
import ErrorScreen from '../Form/ErrorScreen';
import Sidebar from '../Sidebar/Sidebar';
import ResponseTab from '../Form/Response/ResponseTab';

const Home = ({ url, search, collections, onResponseMessageClick }) => {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [errorResponse, setErrorResponse] = useState(false);
    const [apiResponse, setApiResponse] = useState({});
    const [success, setSuccess] = useState(false); // New state for success message
    const { formData, jsonText, paramData, headerData } = useContext(DataContext);

    const onSendClick = async () => {
        if (!checkParams(formData, jsonText, paramData, headerData, setErrorMsg)) {
            setError(true);
            return false;
        }

        const response = await getData(formData, jsonText, paramData, headerData);

        if (response.error) {
            setErrorResponse(true);
            setApiResponse({ error: response.error });
            setError(true);
            setErrorMsg(String(response.message || 'An unknown error occurred'));
            setSuccess(false); 
            return;
        }

        setErrorResponse(false);
        setApiResponse(response);
        setError(false); 
        setSuccess(true);
    };

    const showSnackbar = async (msg) => {
        setErrorMsg(msg);
    };

    return (
        <>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    padding: 2,
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
            >
                {collections && (
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        padding: 2,
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ width: '30%', minWidth: '250px', flexShrink: 0 }}>
                            <Sidebar url={url} search={search}/>
                        </Box>
                        <Box
                            sx={{
                                width: '70%',
                                flexGrow: 1,
                                paddingLeft: 2,
                                maxWidth: 'calc(100% - 300px)',
                                overflow: 'hidden'
                            }}
                        >
                            <Form onSendClick={onSendClick} showSnackbar={showSnackbar} setError={setError} setSuccess={setSuccess}/>
                            <SelectTab />
                            {errorResponse ? <ErrorScreen /> : <ResponseTab apiResponse={apiResponse} onResponseMessageClick={onResponseMessageClick}/>}
                        </Box>
                    </Box>
                )}
                {!collections && (
                    <Box
                    sx={{
                        width: '100%',
                        flexGrow: 1,
                        paddingLeft: 2,
                        overflow: 'hidden'
                    }}
                >
                    <Form onSendClick={onSendClick} showSnackbar={showSnackbar} setError={setError} setSuccess={setSuccess}/>
                    <SelectTab />
                    {errorResponse ? <ErrorScreen /> : <ResponseTab apiResponse={apiResponse} onResponseMessageClick={onResponseMessageClick}/>}
                </Box>
                )}
                
            </Box>
            {error ? (
                <SnackBar errorMsg={errorMsg} error={error} setError={setError} />
            ) : success ? (
                <SuccessfulSnackBar message="Operation was successful!" open={success} setOpen={setSuccess} />
            ) : null}
        </>
    );
};

export default Home;
