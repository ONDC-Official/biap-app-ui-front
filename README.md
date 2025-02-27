# Introduction

Biap APP UI Front(end) app - A consumer facing app built on API's provided by biap-node-js-client

# for whom

This app is intended for anyone building user facing buyer app on ONDC

Built with React js

# Authentication

- using google outh single page authentication
- username/password based

# Server Side Events

- Uses server side events to fetch the data from backend without using XHR
- this makes the app smooth and reactive to incoming data

# Geo functionality

- Uses Geo Map functionality using API from ondc-ancillary-app which is wrapper around map my india

# Cloud Calling

- Uses cloud calling api from ondc-ancillary-app which is a wrapper around knowlarity

# Local Setup:

1. Clone the repo using

```
git clone https://github.com/ONDC-Official/biap-app-ui-front.git
```

2. Install the Dependencies using

```
yarn
```

or

```
npm install
```

3. Create a `.env` file in the root directory and add the values for variables mentioned in `.env.example`

4. Run the app using

```
yarn start
```

or

```
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. This runs the app in the development mode.
