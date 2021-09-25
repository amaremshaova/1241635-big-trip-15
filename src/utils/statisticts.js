import dayjs from 'dayjs';
import { OFFER_TYPE } from '../const.js';

const getWeightForSort = (pointA, pointB) =>{
  if (pointA > pointB) {
    return -1;
  }
  if (pointA < pointB)  {
    return 1;
  }

  return 0;
};


const getWeightTypeForSort = (pointA, pointB) =>
  getWeightForSort(pointA.countPoints, pointB.countPoints);

const getWeightMoneyForSort = (pointA, pointB) =>
  getWeightForSort(pointA.money, pointB.money);

const getWeightTimeSpendForSort = (pointA, pointB) =>
  getWeightForSort(pointA.timeSpend, pointB.timeSpend);

export const countPointsInMoneyRange = (points) =>{
  const moneyTypesArray = new Array().fill();

  const pointsTypes = OFFER_TYPE.map((type) =>
    points.filter((point) => point.type === type));

  pointsTypes.forEach((point, index) => {
    let money = 0;
    point.forEach((item) => money += item.basePrice);
    moneyTypesArray.push({type: OFFER_TYPE[index], money: money});
  });

  return moneyTypesArray.sort(getWeightMoneyForSort);
};


export const countPointsInTypesRange = (points) => {
  const countPointsTypeArray = [];

  OFFER_TYPE.map((type) =>
    countPointsTypeArray.push({type: type, countPoints: points.filter((point) => point.type === type).length}));

  return countPointsTypeArray.sort(getWeightTypeForSort);
};


export const countPointsInTimesSpendRange = (points) => {
  const timesSpendTypesArray = new Array().fill();
  const pointsTypes = OFFER_TYPE.map((type) => points.filter((point) => point.type === type));
  pointsTypes.forEach((pointsType, index) =>{

    let timeSpend = 0;
    pointsType.forEach((point) => timeSpend += (dayjs(point.dateTo).diff(dayjs(point.dateFrom))));
    timesSpendTypesArray.push({type: OFFER_TYPE[index], timeSpend: timeSpend});
  });

  return timesSpendTypesArray.sort(getWeightTimeSpendForSort);
};
