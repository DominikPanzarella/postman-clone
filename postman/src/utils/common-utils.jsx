// Validate if the JSON is valid
const checkValidJson = (text) => {
    if (!text) return true; 
    try {
        JSON.parse(text); 
        return true;
    } catch (error) {
        return false;
    }
};

// Check if formData, jsonText, paramData, and headerData are valid
export const checkParams = (formData, jsonText, paramData, headerData, setErrorMsg) => {
    // Check if the URL is provided
    if (!formData.url) {
        setErrorMsg('Request URL is empty!');
        return false;
    }

    // Validate JSON text
    if (jsonText && !checkValidJson(jsonText)) {
        setErrorMsg('Text is not valid JSON');
        return false;
    }

    // Optional check for paramData (can be empty or undefined)
    if (paramData && !Array.isArray(paramData)) {
        setErrorMsg('Parameters must be an array or undefined.');
        return false;
    }

    // Optional check for headerData (can be empty or undefined)
    if (headerData && !Array.isArray(headerData)) {
        setErrorMsg('Headers must be an array or undefined.');
        return false;
    }

    return true;
};

// Return a new object containing key-value pairs from the input array
export const getHeadersAndParams = (objArr) => {
    return objArr?.reduce((acc, data) => {
        if (data.hasOwnProperty('check') && data.check) {
            acc[data.key] = data.value;
        }
        return acc;
    }, {}) || {}; // Return empty object if objArr is undefined or null
};


export const searchByName = async (name, collections, fetchRequests, setRequests) => {
    let filteredRequests = [];

    for (let col of collections) {
        const req = await fetchRequests(col.id);
        if (Array.isArray(req)) {
            const matchingRequests = req.filter(request => 
                request.name.toLowerCase().includes(name.toLowerCase())
            );

            if (matchingRequests.length > 0) {
                filteredRequests.push({
                    id: col.id,
                    name: col.name,
                    requests: matchingRequests
                });
            }
        }
    }

    setRequests(filteredRequests);
};
