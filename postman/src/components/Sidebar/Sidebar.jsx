// Main Sidebar component
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Typography, Box, TextField, IconButton } from '@mui/material';
import { DataContext } from '../context/DataProvider';
import { makeStyles } from '@mui/styles';
import CollectionList from './CollectionList';
import { fetchCollectionData, fetchRequestsForCollection } from '../../..//service/api';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import SearchBar from './SearchBar';

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

const Sidebar = ({ url, search, collections = true}) => {
  const classes = useStyles();
  const [requestsByCollection, setRequestsByCollection] = useState({});
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  const { 
    setFormData, 
    setParamData, 
    setHeaderData, 
    setJsonText,
    collectionsList, 
    setCollectionsList,
    currentRequest, 
    setCurrentRequest,
    currentCollection, 
    setCurrentCollection,
    dirty, 
    setDirty,
    formData 
  } = useContext(DataContext);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (currentCollection && Number(currentCollection) > 0 && currentCollection !== undefined) {
      fetchRequests(currentCollection);
    }
  }, [currentCollection]);

  useEffect(() => {
    fetchCollections();
    for (let collection of collectionsList) {
      fetchRequests(collection.id);
    }
  }, [dirty]);

  const fetchCollections = async () => {
    console.log(search);
    try {
      const data = await fetchCollectionData(url);
      setCollectionsList(data);

      if (currentCollection && Number(currentCollection) > 0 && currentCollection !== undefined) {
        fetchRequests(currentCollection);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchRequests = async (collectionId) => {
    if (collectionId !== undefined && collectionId <= 3) {
      try {
        const data = await fetchRequestsForCollection(url, collectionId);
        setRequestsByCollection((prev) => ({
          ...prev,
          [collectionId]: data,
        }));
        return data;
      } catch (error) {
        console.error('Error fetching requests:', error);
        return [];
      }
    }
  };

  const handleAccordionChange = (panelId) => async (event, isExpanded) => {
    if (isExpanded) {
      setExpandedCollection(panelId);
      setCurrentCollection(panelId);

      if (panelId && Number(panelId) > 0 && panelId <= 3) {
        fetchRequests(panelId);
      }
    } else {
      setExpandedCollection(null);
      setCurrentCollection([]);
    }
    resetFormData();
  };

  const resetFormData = () => {
    setParamData([]);
    setHeaderData([]);
    formData.url = '';
    setJsonText('');
    setCurrentRequest({});
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCardClick = (request) => {
    setCurrentRequest(request);
    setFormData((prev) => ({ ...prev, url: request.uri, type: request.method }));
    // Format headers and params into key-value pairs
    const formattedHeaders = Object.entries(request.headers || {}).map(([key, value]) => ({ key, value }));
    setHeaderData(formattedHeaders.length === 0 ? [{ key: '', value: '' }] : formattedHeaders);

    const formattedParams = Object.entries(request.params || {}).map(([key, value]) => ({ key, value }));
    setParamData(formattedParams.length === 0 ? [{ key: '', value: '' }] : formattedParams);

    setJsonText(request.body);
  };


  const filterRequests = () => {
    if (!searchTerm.trim()) return requestsByCollection;

    const filtered = {};

    Object.keys(requestsByCollection).forEach((collectionId) => {
      const filteredRequests = requestsByCollection[collectionId].filter((request) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filteredRequests.length > 0) {
        filtered[collectionId] = filteredRequests;
      }
    });

    return filtered;
  };

  const handleExport = async (collection) => {
    try {
      const requests = await fetchRequests(collection.id);
      const exportData = {
        id: collection.id,
        name: collection.name,
        requests: requests
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${collection.name}.json`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const handleImport = () => {
    // Create and trigger a file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processImportedFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Read file content
      const content = await readFileAsJson(file);
      
      // Get the next available collection ID
      const nextId = getNextCollectionId();
      
      // Create a new collection with the imported name and update the ID
      const newCollection = {
        id: nextId,
        name: content.name
      };
      
      // Update the requests to reference the new collection ID
      const updatedRequests = content.requests.map(request => ({
        ...request,
        collectionId: nextId
      }));
      
      // Update the collections list in state
      setCollectionsList(prevCollections => [...prevCollections, newCollection]);
      
      // Update the requestsByCollection state
      setRequestsByCollection(prev => ({
        ...prev,
        [nextId]: updatedRequests
      }));
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error importing collection:', error);
      alert('Failed to import collection. Check console for details.');
    }
  };
  // Helper function to read file as JSON
  const readFileAsJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          resolve(json);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  // Get the next available collection ID
  const getNextCollectionId = () => {
    if (collectionsList.length === 0) return 1;
    
    const maxId = Math.max(...collectionsList.map(collection => collection.id));
    return maxId + 1;
  };

  return (
    <div className="http-client">
      {collections && (
        <div className="collections-sidebar">
          
          {search && (
              <SearchBar onSearch={handleSearchChange} searchTerm={searchTerm}></SearchBar>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={processImportedFile}
          />
          <CollectionList 
            collectionsList={collectionsList}
            expandedCollection={expandedCollection}
            handleAccordionChange={handleAccordionChange}
            handleExport={handleExport}
            handleImport={handleImport}
            filteredRequests={filterRequests()}
            handleCardClick={handleCardClick}
            classes={classes}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;