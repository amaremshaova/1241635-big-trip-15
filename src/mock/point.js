import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import { getOffersArray } from '../utils/get-offers';
import { OFFER_TYPE, generationOffers} from '../utils/get-offers';
import { getRandomInteger } from './get-random-integer';
import { generationDestinations, getDestination, generationCity} from '../utils/get-destinations';


const generationType = () => {
  const randomIndex = getRandomInteger(0, OFFER_TYPE.length - 1);
  return OFFER_TYPE[randomIndex];
};


const generationCost = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generationFromDate = () => {
  const date = dayjs();
  return date.toISOString();
};

const generationToDate = () =>{
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(0, maxDaysGap);
  const date = dayjs().add(daysGap, 'days');
  return date.toDate();
};


const generatePoint = () => {
  const type = generationType();
  const name = generationCity();

  const destinations = generationDestinations();
  const offers = generationOffers();

  return {
    id: nanoid(),
    basePrice: generationCost(100, 1000),
    dateFrom: generationFromDate(),
    dateTo: generationToDate(),
    isFavorite: false,
    type: type,
    destination: getDestination(destinations, name),
    offers: getOffersArray(offers, type),
    isFuture: false,
    isPast: true,
  };

};


export {generatePoint};
