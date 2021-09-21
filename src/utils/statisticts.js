import dayjs from 'dayjs';
import { OFFER_TYPE } from '../const.js';

export const countPointsInMoneyRange = (points) =>{
  const moneyTypesArray = new Array().fill();

  const pointsTypes = OFFER_TYPE.map((type) =>
    points.filter((point) => point.type === type));

  pointsTypes.forEach((point) => {
    let money = 0;
    point.forEach((item) => money += item.basePrice);
    moneyTypesArray.push(money);
  });

  return moneyTypesArray;
};


export const countPointsInTypesRange = (points) => OFFER_TYPE.map((type) =>
  points.filter((point) => point.type === type).length);


export const countPointsInTimesSpendRange = (points) => {
  const timesSpendTypesArray = new Array().fill();
  const pointsTypes = OFFER_TYPE.map((type) => points.filter((point) => point.type === type));
  pointsTypes.forEach((pointsType) =>{

    let timeSpend = 0;
    pointsType.forEach((point) => timeSpend += (dayjs(point.dateTo).diff(dayjs(point.dateFrom))));
    timesSpendTypesArray.push((timeSpend));
  });

  return timesSpendTypesArray;
};
