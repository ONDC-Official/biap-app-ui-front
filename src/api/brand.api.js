import { getCall } from "./axios";

/**
 * function to get all brands
 * @returns
 */
export const getAllBrandsRequest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/providers`);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get brand details
 * @returns
 */
export const getBrandDetailsRequest = (brandId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const data = await getCall(`/clientApis/v2/providers/${brandId}`);
            const data = await getCall(`/protocol/providers/${brandId}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get brand details
 * @returns
 */
export const getBrandCustomMenuRequest = (domain) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const data = await getCall(`/clientApis/v2/custom-menus?domain=${domain}`);
            const data = await getCall(`/protocol/custom-menus?domain=${domain}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get brand details
 * @returns
 */
export const getCustomMenuItemsRequest = (menuName) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const data = await getCall(`/clientApis/v2/items?customMenu=${menuName}`);
            const data = await getCall(`/protocol/items?customMenu=${menuName}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get all outlets
 * @returns
 */
export const getAllOutletsRequest = (brandId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const data = await getCall(`/clientApis/v2/locations?provider=${brandId}`);
            const data = await getCall(`/protocol/locations?provider=${brandId}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get outlet details
 * @returns
 */
export const getOutletDetailsRequest = (locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const data = await getCall(`/clientApis/v2/locations/${locationId}`);
            const data = await getCall(`/protocol/locations/${locationId}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};