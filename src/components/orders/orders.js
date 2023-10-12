import React, { useEffect } from "react";
import useStyles from "./style";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useHistory, useLocation } from "react-router-dom";

import OnGoingOrders from "./onGoingOrders/onGoingOrders";
import CompletedOrders from "./completedOrders/completedOrders";
import CancelledOrders from "./cancelledOrders/cancelledOrders";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Orders = () => {
  const classes = useStyles();
  const locationData = useLocation();
  const history = useHistory();

  const useQuery = () => {
    const { search } = locationData;
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const [tabValue, setTabValue] = React.useState("");

  const handleTabChange = (event, newValue) => {
    history.push(`/application/orders?o=${newValue}`);
  };

  useEffect(() => {
    if (locationData) {
      const tabVal = query.get("o");
      if (tabVal) {
        setTabValue(tabVal);
      } else {
        setTabValue("ongoing");
      }
    }
  }, [locationData]);

  const renderTabContent = (tabVal) => {
    switch (tabVal) {
      case "ongoing":
        return <OnGoingOrders />;
      case "completed":
        return <CompletedOrders />;
      case "cancelled":
        return <CancelledOrders />;
      default:
        return <OnGoingOrders />;
    }
  };

  return (
    <Grid container spacing={3} className={classes.ordersContainer}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Typography variant="h3" className={classes.orderHistoryTypo}>
          Orders History
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}></Grid>
      {tabValue && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="orders tabs example"
          >
            <Tab value="ongoing" label="Ongoing" />
            <Tab value="completed" label="Completed" />
            <Tab value="cancelled" label="Cancelled" />
          </Tabs>
          <TabPanel value={tabValue} index={tabValue} className={classes.tabTanelContainer}>
            {renderTabContent(tabValue)}
          </TabPanel>
        </Grid>
      )}
    </Grid>
  );
};

export default Orders;
