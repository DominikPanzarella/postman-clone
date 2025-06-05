import { useState, useContext } from 'react';

import { Box, Tabs, Tab } from '@mui/material';
import { makeStyles } from '@mui/styles';
import  CreateTable from '../Table/CreateTable';
import CreateJsonText from '../Body/CreateJsonText';
import { DataContext } from '../../context/DataProvider';

const useStyles = makeStyles({
    component: {
        marginTop: 20
    },
    tab: {
        textTransform: ['none', '!important'],
        '&::active': {
            border: '1px solid #fff'
        }
    }
})

const SelectTab = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const { paramData, setParamData, headerData, setHeaderData } = useContext(DataContext);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }



    return (
        <Box className={classes.component}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" 
                TabIndicatorProps={{ sx: { backgroundColor: "#F26B3A", height: 4, bottom: 2} }}
            
            >
                <Tab label="Headers" className={classes.tab}/>
                <Tab label="Body"  className={classes.tab}/>
            </Tabs>
            <Box
                role="tabpanel"
                hidden={value !== 0}
                id={`simple-tabpanel-${0}`}
                aria-labelledby={`simple-tab-${0}`}
                >
                    <CreateTable text={'Headers'} data={headerData} setData={setHeaderData}/>
            </Box>

            <Box
                role="tabpanel"
                hidden={value !== 1}
                id={`simple-tabpanel-${1}`}
                aria-labelledby={`simple-tab-${1}`}
                >

                    <CreateJsonText></CreateJsonText>
            </Box>
        </Box>
    )
}

export default SelectTab;