import AbstractView from './abstract.js';

const createCostTripTemplate = (costTrip) => (`
<p class="trip-info__cost">
Total: &euro;&nbsp;<span class="trip-info__cost-value">${costTrip}</span>
</p>`);

export default class CostTpip extends AbstractView{
  constructor(cost) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return createCostTripTemplate(this._cost);
  }

}
