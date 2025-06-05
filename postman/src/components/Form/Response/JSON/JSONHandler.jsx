import { Typography, Box, Tabs, Tab } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import ResponseJSON from "./ResponseJSON";
import JSONPreview from "./JSONPreview";

const useStyles = makeStyles({

    component: {
      marginTop: 20
    },
    tab: {
      textTransform: 'none !important',
      fontWeight: 500,
      borderRadius: '8px',
      padding: '8px 16px',
      minHeight: '32px',
      minWidth: '100px',
      color: '#666', // Default text color
      backgroundColor: '#808080', // Light grey background
      transition: 'all 0.2s ease-in-out',
      '&.Mui-selected': {
        color: '#000', // Active tab text color
        backgroundColor: '#B0B0B0', // Darker grey background when selected
        fontWeight: 'bold',
      },
      '&:hover': {
        backgroundColor: '#D8D8D8', // Slight hover effect
      },
      '&.Mui-selected:focus': {
        outline: 'none', // Remove the blue outline/focus ring when selected
      },
      '&:focus': {
        outline: 'none', // Remove the blue outline/focus ring when focused
      }
    }
  });

const JSONHandler = ({apiResponse}) => {

    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) =>{
        setValue(newValue);
    }

    console.log(apiResponse);
    
    return (
        <Box className={classes.component}>
       <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" 
           TabIndicatorProps={{ style: { display: 'none'}}}
           >
            <Tab label="Pretty" className={classes.tab}/>
            <Tab label="Preview" className={classes.tab}/>
        </Tabs>

        <Box
            role="tabpanel"
            hidden={value !== 0}
            id={`simple-tabpanel-${0}`}
            aria-labelledby={`simple-tab-${0}`}
        >
            <ResponseJSON data={apiResponse.data.body}/>
        </Box>

        <Box
            role="tabpanel"
            hidden={value !== 1}
            id={`simple-tabpanel-${1}`}
            aria-labelledby={`simple-tab-${1}`}
        >
          <JSONPreview responseData={apiResponse.data.body}></JSONPreview>
        </Box>

    </Box>

    );
};

export default JSONHandler;