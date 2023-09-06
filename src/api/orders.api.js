import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllOrdersRequest = (paginationData) => {
    const pageNumber = paginationData.page;
    const limit = paginationData.pageSize;
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?limit=${limit}&pageNumber=${pageNumber}`
            const data = await getCall(`/clientApis/v2/orders${quaryParams}`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};