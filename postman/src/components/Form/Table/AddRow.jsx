
import { useState,useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, Checkbox, TableCell, TableRow, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataContext } from '../../context/DataProvider';

const useStyles = makeStyles({
    textfield: {
        width: '100%'
    },
    tablecell: {
        padding: ['2px 5px', '!important'],
        border: '1px solid rgba(224, 224, 224, 1)',
        borderCollapse: 'collapse'
    },
    checkbox: {
        padding: ['2px 5px', '!important'],
    }
});

const AddRow = ({ addRows, rowId,setData, data, prevData,onDeleteItem,modifiable }) => {
    const classes = useStyles();

    const [checkCheckbox, setCheckCheckbox] = useState(data?.check || false);
    const [keyValue, setKeyValue] = useState(data?.key || '');
    const [valueValue, setValueValue] = useState(data?.value || '');

    useEffect(() => {
        if (data) {
            setCheckCheckbox(data.check || false);
            setKeyValue(data.key || '');
            setValueValue(data.value || '');
        }
    }, [data]);

    
    const handleCheckboxChange = () => {
        setCheckCheckbox(!checkCheckbox);
        setData(prevData => {
            return prevData.map((row, index) => {
                if (index === rowId) {
                    return { ...row, check: !checkCheckbox, key: keyValue, value: valueValue };
                }
                return row;
            });
        });
    };

    const onKeyChange = (e) => {
        const newKey = e.target.value;
        setKeyValue(newKey);
        setData(prevData => {
            return prevData.map((row, index) => {
                if (index === rowId) {
                    return { ...row, key: newKey, check: checkCheckbox, value: valueValue };
                }
                return row;
            });
        });
    };

    const onValueChange = (e) => {
        const newValue = e.target.value;
        setValueValue(newValue);
        setData(prevData => {
            return prevData.map((row, index) => {
                if (index === rowId) {
                    return { ...row, value: newValue, check: checkCheckbox, key: keyValue };
                }
                return row;
            });
        });
    };

    
    return (
        <TableRow>
            {
                modifiable && (
                    <TableCell className={classes.tablecell}>
                    <Checkbox 
                        checked={checkCheckbox}
                        className={classes.checkbox} 
                        size='large' 
                        name={rowId}
                        onChange={(e) => handleCheckboxChange(e)} />
                </TableCell>
                )
            }
            <TableCell className={classes.tablecell}>
                <TextField 
                    className={classes.textfield}
                    inputProps={{ style: { height: 30, padding: '0 5px' } }}
                    name="key"
                    value={keyValue}
                    onChange={(e) => onKeyChange(e)}
                    disabled={!modifiable}

                />
            </TableCell>
            <TableCell className={classes.tablecell}>
                <TextField className={classes.textfield}
                    inputProps={{ style: { height: 30, padding: '0 5px' } }}
                    name="value"
                    value={valueValue}
                    onChange={(e) => onValueChange(e)}
                    disabled={!modifiable}
            /></TableCell>
            {
                modifiable && (
                    <TableCell className={classes.tablecell} align="center">
                    <IconButton onClick={()=>onDeleteItem(rowId)} size="small">
                        <DeleteIcon color="error" />
                    </IconButton>
                </TableCell>
                )
            }


        </TableRow>
    )
}

export default AddRow;