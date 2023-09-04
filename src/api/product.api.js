import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllProductRequest = (data) => {
    const pageNumber = data.page;
    const limit = data.pageSize;
    const productName = data?.searchData?.productName || "";
    const subCategoryName = data?.searchData?.subCategoryName || "";
    const providerIds = data?.searchData?.brandId || "";
    return new Promise(async (resolve, reject) => {
        try {
            const quaryParams = `?limit=${limit}&pageNumber=${pageNumber}${subCategoryName?`&categoryIds=${subCategoryName}`:''}${productName?`&productName=${productName}`:""}${providerIds?`&providerIds=${providerIds}`:""}`
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