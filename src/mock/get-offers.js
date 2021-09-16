import { getRandomInteger } from "./get-random-integer";
export const OFFER_TYPE = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TAXI_TITLES_OFFER = [
  'Upgrade to a business class',
  'Choose the radio station',
];

const BUS_TITLES_OFFER = [
  'Choose meal',
  'Upgrade to comfort class',
];

const generationOfferArray = (typeOffer) => {
  const offer = [];
  let title;

  if (typeOffer === 'taxi'){
    for (title of TAXI_TITLES_OFFER){
      const titleOffer = title;
      const priceOffer = getRandomInteger(0, 1000);

      offer.push ({title: titleOffer, price: priceOffer});
    }
  }
  else if (typeOffer === 'bus'){
    for (title of BUS_TITLES_OFFER){
      const titleOffer = title;
      const priceOffer = getRandomInteger(0, 1000);

      offer.push ({title: titleOffer, price: priceOffer});
    }
  }
  return offer;

};


export const generationOffers = () => {
  const offers = new Array(OFFER_TYPE.length);
  let typeIndex;

  for (typeIndex = 0; typeIndex < OFFER_TYPE.length; typeIndex++)
  {
    offers.push({type: OFFER_TYPE[typeIndex], offers: generationOfferArray(OFFER_TYPE[typeIndex])});
  }
  return offers;
};

export const getOffersArray = (offers, type) => {
  const offersArray = offers.filter ((offer) => offer.type === type);

  return offersArray[0].offers;
};
