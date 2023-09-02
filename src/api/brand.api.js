import { getCall } from "./axios";

/**
 * function to get all products
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