import React, { useState, createContext } from 'react';

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    
    const [formData, setFormData] = useState({ url: '', type: 'POST' })
    const [jsonText, setJsonText] = useState('');
    const [paramData, setParamData] = useState([{key:'', value:'', check:false}]);
    const [headerData, setHeaderData] = useState([{key:'', value:'', check:false},{key:'', value:'', check:false},{key:'', value:'', check:false},{key:'', value:'', check:false}]);
    const [collectionsList, setCollectionsList] = useState([]);
    const [currentRequest, setCurrentRequest] = useState([]);
    const [currentCollection, setCurrentCollection] = useState([]);
    const [dirty, setDirty] = useState(0);

    return (
        <DataContext.Provider
            value={{
                formData,
                setFormData,
                jsonText,
                setJsonText,
                paramData,
                setParamData,
                headerData,
                setHeaderData,
                collectionsList,
                setCollectionsList,
                currentRequest,
                setCurrentRequest,
                currentCollection,
                setCurrentCollection,
                dirty,
                setDirty
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;