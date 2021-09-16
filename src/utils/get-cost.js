export const getCostTrip = (points) => {
  let summa = 0;
  points.forEach((point) =>  summa += point.basePrice);
  return summa;
};
