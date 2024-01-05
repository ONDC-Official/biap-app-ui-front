import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllOrdersRequest = (paginationData) => {
    const pageNumber = paginationData.page;
    const limit = paginationData.pageSize;
    const state = paginationData.status
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?limit=${limit}&pageNumber=${pageNumber}&state=${state}`
            const data = await getCall(`/clientApis/v2/orders${quaryParams}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};

export const getOrderDetailsRequest = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/orders/${orderId}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};