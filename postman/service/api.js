import axios from 'axios';
import { getHeadersAndParams } from '../src/utils/common-utils';
import { Suspense } from 'react';

// Axios interceptors setup (can be in a separate file like axiosSetup.js)

axios.interceptors.request.use(function (config) {
    config.metadata = { startTime: new Date() };
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    response.config.metadata.endTime = new Date();
    response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
    console.log('Request Duration: ', response.duration, 'ms');
    return response;
}, function (error) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
    console.error('Request failed, Duration: ', error.duration, 'ms');
    return Promise.reject(error);
});

export const getData = async (formData, jsonText, paramData, headerData) => {
    const apiType = formData.type;
    const apiUrl = formData.url;
    const apiHeaders = getHeadersAndParams(headerData);
    const apiParams = getHeadersAndParams(paramData);
    const data = apiType === 'GET' ? '' : jsonText;

    const transformedHeaders = Object.entries(apiHeaders).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value : [String(value)];
        return acc;
    }, {});

    const supsiData = {
        method: apiType,
        uri: apiUrl,
        headers: transformedHeaders,
        body: data
    };

    try {
        const response = await axios({
            method: 'POST',
            url: 'https://supsi-ticket.cloudns.org/supsi-http-client/proxy/execute',
            data: supsiData, 
            headers: {'Content-Type': ['application/json'], 'Accept': ['application/json']},
        });

        return response;

    } catch (error) {
        console.log('Error while getting the response: ', error);
        return {
            error: true,
            message: error.message || 'An error occurred'
        };
    }
};

export const fetchCollectionData = async (baseUrl) => {
    try {
      const response = await fetch(`${baseUrl}/collections`);
      const text = await response.text();
  
      if (!response.ok || text.startsWith("<!DOCTYPE html>")) {
        throw new Error(`HTTP ${response.status}: Server returned non-JSON response`);
      }
  
      return JSON.parse(text);
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  };
  
  export const fetchRequestsForCollection = async (baseUrl, collectionId) => {
    try {
      const response = await fetch(`${baseUrl}/collections/${collectionId}/requests?apiKey=spapanz1`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  };
  