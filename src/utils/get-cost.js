export const getCostTrip = (points) => {
  let summa = 0;
  points.forEach((point) => {
    summa += point.basePrice;
    point.offers.forEach((offer) => summa += offer.price);
  });
  return summa;
};
