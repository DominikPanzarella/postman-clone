import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Tabs, Tab, Typography, Divider } from '@mui/material';
import WaitingResponse from './WaitingResponse';
import CreateTable from '../Table/CreateTable';
import ResponseHandler from './ResponseHandler';

const useStyles = makeStyles({
    component: {
        marginTop: 20
    },
    tab: {
        textTransform: 'none',
        '&::active': {
            border: '1px solid #fff'
        }
    },
    tabContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    leftTabs: {
        display: 'flex',
    },
    rightTabs: {
        display: 'flex',
        marginLeft: 'auto',
    },
    statusSection: {
        marginBottom: 20
    },
    tabSection: {
        marginTop: 20
    }
});

const ResponseTab = ({ apiResponse, onResponseMessageClick }) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [responseTime, setResponseTime] = useState(null);
    const [statusCode, setStatusCode] = useState(null);
    const [dimension, setDimension] = useState(null);

    useEffect(() => {
        if (apiResponse?.duration) {
            setResponseTime(apiResponse.duration);
        }
        else{
            setResponseTime("N/A");
        }
        if (apiResponse?.status) {
            console.log(apiResponse.data.status);
            setStatusCode(apiResponse.data.status);
        }else{
            setResponseTime("N/A");
        }
    }, [apiResponse]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const isValidResponse = apiResponse && Object.keys(apiResponse).length > 0 && apiResponse.data;

    const convertArray = (obj) => {
        return Object.keys(obj)
        .filter(v => obj[v] != null)
        .map(key => ({ key: key, value: obj[key][0] }));
    }
;
    const getApiResponseDimension = (apiResponse) => {
        const bodyString = JSON.stringify(apiResponse.data.body);
        const bodyByteLength = new TextEncoder().encode(bodyString).length;
      
        const headersString = JSON.stringify(apiResponse.headers);
        const headersByteLength = new TextEncoder().encode(headersString).length;
      
        const totalByteLength = bodyByteLength + headersByteLength;
      
        const totalKbLength = totalByteLength / 1024;
      
        return {
          bodyBytes: bodyByteLength,
          headerBytes: headersByteLength,
          totalBytes: totalByteLength,
          totalKilobytes: totalKbLength,
        };
      };

    return (
        <Box className={classes.component}>
            <Divider sx={{ my: 2 }} />
                
            {!isValidResponse ? (
                <Box>
                    <Typography variant="h6" mt={2} mb={2}>
                        Response
                    </Typography>
                    <WaitingResponse />
                </Box>
            ) : (
                <>
                    <Box className={classes.tabContainer}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="response tabs"
                            TabIndicatorProps={{ sx: { backgroundColor: "#F26B3A", height: 4, bottom: 2 } }}
                        >
                            <Tab label="Body" className={classes.tab} />
                            <Tab label="Headers" className={classes.tab} />
                        </Tabs>

                        <Box className={classes.rightTabs}>
                            <Tabs aria-label="extra tabs">
                                <Tab 
                                    label={statusCode} 
                                    className={classes.tab} 
                                    sx={{ color: 'green' }} // Apply green color to the status message
                                />
                                <Tab 
                                    label={`${responseTime} ms`} 
                                    className={classes.tab} 
                                    sx={{ color: 'green' }} // Apply green color to the response time
                                />
                                <Tab 
                                    label={`${getApiResponseDimension(apiResponse).totalKilobytes.toFixed(2)} Kb`}
                                    className={classes.tab} 
                                    sx={{ color: 'green' }} // Apply green color to the response time
                                />
                            </Tabs>
                        </Box> 
                    </Box>

                    <Box
                        role="tabpanel"
                        hidden={value !== 0}
                        id={`simple-tabpanel-${0}`}
                        aria-labelledby={`simple-tab-${0}`}
                    >
                        <ResponseHandler apiResponse={apiResponse} onResponseMessageClick={onResponseMessageClick}></ResponseHandler>
                    </Box>

                    <Box
                        role="tabpanel"
                        hidden={value !== 1}
                        id={`simple-tabpanel-${1}`}
                        aria-labelledby={`simple-tab-${1}`}
                        >
                            <CreateTable text="" data={convertArray(apiResponse.data.headers)} setData={() => {}} modifiable={false} />
                    </Box>

            
                </>
            )}
        </Box>
    );
};

export default ResponseTab;
