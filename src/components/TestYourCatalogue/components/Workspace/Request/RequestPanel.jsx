import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { convertKeyValueToObject } from '../../../../../utils/helpers';
import UrlEditor from '../../Panes/RequestUrl/UrlEditor';
import RequestTabGroup from '../../Tab-Groups/RequestTabGroup';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

const keyPairInitState = [
  {
    id: uuidv4(),
    keyItem: '',
    valueItem: '',
  },
];

export default function Request({ setResponse, setLoading, loading }) {
  const [url, setUrl] = useState(
    'protocol/test/v1/on_search'
  );
  const [reqMethod, setReqMethod] = useState('POST');
  const [queryParams, setQueryParams] = useState(keyPairInitState);
  const [headers, setHeaders] = useState(keyPairInitState);
  const [body, setBody] = useState('{\n\t\n}');

  const handleOnInputSend = async (e) => {
    setLoading(true);

    e.preventDefault();
    const requestBody = body.toString();
    console.log('http method', reqMethod);
    console.log('headers', headers);
    console.log('query params ', queryParams);
    console.log('body ', requestBody);

    let data;
    try {
      data = JSON.parse(requestBody);
    } catch (e) {
      alert('Something is wrong with the JSON data.');
    }

    try {
      const response = await axios({
        url: url,
        method: reqMethod,
        params: convertKeyValueToObject(queryParams),
        headers: convertKeyValueToObject(headers),
        data,
      });

      setResponse(response);
    } catch (e) {
      console.log(e.response);
      setResponse(e.response);
    }

    setLoading(false);
  };
  return (
    <>
      <UrlEditor
        url={url}
        setUrl={setUrl}
        reqMethod={reqMethod}
        setReqMethod={setReqMethod}
        onInputSend={handleOnInputSend}
      />
      <RequestTabGroup
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        headers={headers}
        setHeaders={setHeaders}
        body={'{\n\t\n}'}
        setBody={setBody}
      />
    </>
  );
}
