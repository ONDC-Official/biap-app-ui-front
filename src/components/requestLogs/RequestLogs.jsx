import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import _ from 'lodash';
import Input from "../shared/input/input";
import AppBar from "@mui/material/AppBar";
import {DataGrid} from "@mui/x-data-grid";

const RequestLogs = () => {
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });
  const [filters, setFilters] = useState({
    action: '', transaction_id: '', message_id: '', bpp_id: ''
  });
  const [totalRows, setTotalRows] = useState(0);
  const rowCountRef = React.useRef(totalRows || 0);

  const rowCount = React.useMemo(() => {
    if (totalRows !== undefined) {
      rowCountRef.current = totalRows;
    }
    return rowCountRef.current;
  }, [totalRows]);


  const fetchData = async (page, rowsPerPage, filters) => {
    const {data} = await axios.get(`${process.env.REACT_APP_BASE_URL}protocol/request-logs`, {
      params: {
        page_number: page + 1,
        pageSize: rowsPerPage,
        ...filters,
      },
    });
    setData(data.data);
    setTotalRows(data.count);
  };

  const handleFilterChange = _.throttle((field, value) => {
    setFilters((prevFilters) => ({...prevFilters, [field]: value}));
    setPaginationModel({
      pageSize: paginationModel.pageSize,
      page: 0,
    });
  }, 500);

  useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, filters).then(r => {
    });
  }, [paginationModel, filters]);

  return (
    <Box sx={{backgroundColor: '#ebebeb'}}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6">
              Request Logs
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{m: 2}}>
        <Box sx={{p: 2, backgroundColor: '#fff', borderRadius: 1}}>
          <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Input
              variant={'outlined'}
              label_name="Action"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
            />
            <Input
              variant={'outlined'}
              label_name="BPP ID"
              value={filters.transaction_id}
              onChange={(e) => handleFilterChange('bpp_id', e.target.value)}
            />
            <Input
              variant={'outlined'}
              label_name="Transaction ID"
              value={filters.transaction_id}
              onChange={(e) => handleFilterChange('transaction_id', e.target.value)}
            />
            <Input
              variant={'outlined'}
              label_name="Message ID"
              value={filters.message_id}
              onChange={(e) => handleFilterChange('message_id', e.target.value)}
            />
          </Box>
          <Divider sx={{borderColor: '#2f2f2f', mt: 1}}/>
          <DataGrid
            className={'request-logs'}
            checkboxSelection={false}
            rowCount={rowCount}
            getRowId={() => Math.floor(Math.random() * 100000000)}
            getRowHeight={() => 'auto'}
            rows={data}
            columns={[{field: 'action', headerName: 'Action', width: 150},
              {
                field: 'request', headerName: 'Request',
                flex: 1, minWidth: 300,
                renderCell: ({row}) => {
                  return (
                    <Box display={'flex'} alignItems={'flex-end'}>
                      <Typography variant={'body1'} sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        textOverflow: 'ellipsis',
                      }}>{JSON.stringify(row.request)}</Typography>
                      <Typography sx={{cursor: 'pointer'}}  color={'primary'}
                                  variant={'body1'}
                                  onClick={() => navigator.clipboard.writeText(JSON.stringify(row.request))}>
                        Copy
                      </Typography>
                    </Box>
                  )
                }
              },
              {
                field: 'response', headerName: 'Response',
                flex: 1, minWidth: 300,
                renderCell: ({row}) => (
                  <Box display={'flex'} alignItems={'flex-end'}>
                    <Typography variant={'body1'} sx={{
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      textOverflow: 'ellipsis',
                    }} component={'span'}>{JSON.stringify(row.response)}</Typography>
                    <Typography sx={{cursor: 'pointer'}} color={'primary'}
                                variant={'body1'} component={'span'}
                                onClick={() => navigator.clipboard.writeText(JSON.stringify(row.response))}>
                      Copy
                    </Typography>
                  </Box>
                ),
              }]}
            initialState={{
              pagination: {
                paginationModel: {page: 0, pageSize: 10},
              },
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            paginationMode="server"
          />
        </Box>
      </Box>
    </Box>
  )

};

export default RequestLogs;
