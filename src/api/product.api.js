import { getCall } from "./axios";

/**
 * function to get all products
 * @returns
 */
export const getAllProductRequest = (data) => {
    const pageNumber = data.page;
    const limit = data.pageSize;
    let productName = data?.searchData?.productName || "";
    let subCategoryName = data?.searchData?.subCategoryName || "";
    const providerIds = data?.searchData?.brandId || "";
    const customMenu = data?.searchData?.customMenu || "";
    let params = {
        limit: limit,
        pageNumber: pageNumber,
    };
    if(subCategoryName){
        subCategoryName = subCategoryName.replace("And", "&");
        params.categoryIds = subCategoryName;
    }
    if(productName){
        productName = productName.replace("And", "&");
        params.productName = productName;
    }
    if(providerIds){
        params.providerIds = providerIds;
    }
    if(customMenu){
        params.customMenu = customMenu;
    }else{}
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/search`, params);
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
    let subCategoryName = subCatName.replace("And", "&");
    let params = {
        category: subCategoryName,
    };
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/attributes`, params);
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
    let subCategoryName = subCatName.replace("And", "&");
    let params = {
        attribute_code: attributeCode,
        category: subCategoryName,
    };
    return new Promise(async (resolve, reject) => {
        try {
            const data = await getCall(`/clientApis/v2/attributeValues`, params);
            return resolve(data.response);
        } catch (err) {
            return reject(err);
        }
    });
};