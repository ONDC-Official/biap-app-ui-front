export const getSelectedOffers = () => {
  const offers = JSON.parse(localStorage.getItem("offers") || "{}");
  let offer_ids = [];
  if (offers.additive_offers?.length > 0) {
    offer_ids = [...offers.additive_offers];
  }
  if (offers.non_additive_offer) {
    offer_ids.push(offers.non_additive_offer);
  }
  return offer_ids;
};
