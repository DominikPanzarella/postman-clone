import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableCell, TableRow, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import AddRow from './AddRow';

const useStyles = makeStyles({
    textfield: {
        width: '100%'
    },
    tablecell: {
        padding: ['7px 5px', '!important'],
        border: '1px solid rgba(224, 224, 224, 1)',
        borderCollapse: 'collapse'
    },
    checkbox: {
        padding: ['2px 5px', '!important'],
    },
    addButton: {
        marginTop: '10px',
    },
});

const CreateTable = ({ text, data, setData, modifiable = true }) => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        setRows(data);
    }, [data]);

    const deleteRow = (rowId) => {
        if (modifiable) {
            setData((prevData) => prevData.filter((_, index) => index !== rowId));
        }
    };

    const addRow = () => {
        if (modifiable) {
            setData((prevData) => [...prevData, {}]);
        }
    };

    return (
   
        <Box>
            <Typography mt={2} mb={2} sx={{ paddingBottom: '10px' }}>{text}</Typography>
            <Table sx={{ minWidth: '100%', border: '1px solid rgba(224, 224, 224, 1)', marginBottom: '15px' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {modifiable && <TableCell className={classes.tablecell}></TableCell>}
                        <TableCell className={classes.tablecell}>KEY</TableCell>
                        <TableCell className={classes.tablecell}>VALUE</TableCell>
                        {modifiable && <TableCell className={classes.tablecell} width="60"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <AddRow
                            key={index}
                            rowId={index}
                            setData={setData}
                            data={row}
                            onDeleteItem={modifiable ? deleteRow : null} 
                            prevData={rows}
                            modifiable={modifiable} 
                        />
                    ))}
                </TableBody>
            </Table>
            {modifiable && (
                <Button variant="contained" className={classes.addButton} onClick={addRow}>
                    <AddIcon />
                </Button>
            )}
        </Box>
    );
};

export default CreateTable;
