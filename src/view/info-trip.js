import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createInfoTripTemplate = (infoTrip) => {

  const {isManyCities, cities, startDate,  endDate} = infoTrip;

  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${isManyCities ? `${cities[0]} &mdash; ... &mdash; ${cities[cities.length-1]}`
    : cities.join(' &mdash; ')}</h1>

  <p class="trip-info__dates"> ${dayjs(startDate).format('MMM DD')} &mdash;
  ${dayjs(endDate).format('MMM DD')}</p>
  </div>`;};


export default class InfoTrip extends AbstractView{
  constructor(infoTrip) {
    super();
    this._infoTrip = infoTrip;
  }

  getTemplate() {
    return createInfoTripTemplate(this._infoTrip);
  }

}
