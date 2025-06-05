import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch, searchTerm }) => {


    return (
        <Box sx={{ paddingBottom: 2 }}>
            <TextField
                label="Search Request"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={onSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;