import dayjs from 'dayjs';
import SmartView from './smart.js';

const createInfoTripTemplate = (infoTrip) => {

  const {isManyCities, cities, startDate,  endDate, cost} = infoTrip;

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
  <h1 class="trip-info__title">${isManyCities ? `${cities[0]} &mdash; ... &mdash; ${cities[cities.length-1]}`
    : cities.join(' &mdash; ')}</h1>

  <p class="trip-info__dates"> ${dayjs(startDate).format('MMM DD')} &mdash;
  ${dayjs(endDate).format('MMM DD')}</p>
  </div>

  <p class="trip-info__cost">
Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
</p>
</section>`;};


export default class InfoTrip extends SmartView{
  constructor(infoTrip) {
    super();
    this._infoTrip = infoTrip;
  }

  getTemplate() {
    return createInfoTripTemplate(this._infoTrip);
  }

}
