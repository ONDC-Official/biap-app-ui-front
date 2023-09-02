import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllDeliveryAddressRequest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v1/delivery_address`);
            return resolve(data);
        } catch (err) {
            return reject(err);
        }
    });
};