import dayjs from 'dayjs';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortPointDay = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
};

export const sortPointTime = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  const durationPointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationPointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  if (weight !== null) {
    return weight;
  }

  return durationPointA - durationPointB;
};

export const sortPointPrice = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.basePrice, pointB.basePrice);

  if (weight !== null) {
    return weight;
  }

  return pointA.basePrice - pointB.basePrice;
};

export const isPointFuture = (dateFrom, dateTo) =>
  dateFrom === null ? false : ((dayjs(dateFrom).isAfter(dayjs()) ||  dayjs(dateFrom).isSame(dayjs())) ||
  (dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs())));

export const isPointPast = (dateFrom, dateTo) =>
  dateTo === null ? false : ((dayjs(dateFrom).isBefore(dayjs())) ||
(dayjs(dateFrom).isBefore(dayjs()) && dayjs(dateTo).isAfter(dayjs())));

export const getOffersArray = (offers, type) => {
  const offersArray = offers.filter ((offer) => offer.type === type);
  console.log(offersArray[0].offers);

  return offersArray[0].offers;
};


export const getDuration = (duration) =>{
  //const duration = dayjs(dateTo).diff(dayjs(dateFrom));

  const durationDays = Math.floor(duration / (1000 * 60 * 60 * 24));
  const durationHours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const durationMinutes = Math.ceil((duration / (1000 * 60)) % 60);

  const days = (durationDays < 10) ? `0${durationDays}` : durationDays;
  const hours = (durationHours < 10) ? `0${durationHours}` : durationHours;
  const minutes = (durationMinutes < 10) ? `0${durationMinutes}` : durationMinutes;

  if ((Number(days) === 0) && (Number(hours) === 0)){
    return `${minutes}M`;
  }
  if (Number(days) === 0){
    return `${hours}H ${minutes}M`;
  }
  else {
    return `${days}D ${hours}H ${minutes}M`;
  }
};
