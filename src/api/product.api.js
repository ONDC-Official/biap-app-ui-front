import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllProductRequest = (data) => {
    const pageNumber = data.page+1;
    const limit = data.pageSize;
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?limit=${limit}&pageNumber=${pageNumber}&categoryIds=${"Pizza"}`
            const data = await getCall(`/clientApis/v2/search${quaryParams}`);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get all filters
 * @returns
 */
export const getAllFiltersRequest = (subCatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?category=${subCatName}`
            const data = await getCall(`/clientApis/v2/attributes${quaryParams}`);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};

/**
 * function to get all filters
 * @returns
 */
export const getAllFilterValuesRequest = (attributeCode, subCatName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?attribute_code=${attributeCode}&category=${subCatName}`
            const data = await getCall(`/clientApis/v2/attributeValues${quaryParams}`);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};