import { getCall } from "./axios";

/**
 * function to get all brands
 * @returns
 */
export const getAllOffersRequest = (domain = "", lat, lng) => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = "";
      if (domain) {
        url = `/protocol/location-offers?domain=${domain}&latitude=${lat}&longitude=${lng}`;
      } else {
        url = `/protocol/location-offers?latitude=${lat}&longitude=${lng}`;
      }
      const data = await getCall(url);
      return resolve(data.data);
    } catch (err) {
      return reject(err);
    }
  });
};