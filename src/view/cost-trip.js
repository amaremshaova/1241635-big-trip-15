import AbstractView from './abstract.js';

const createCostTripTemplate = (costTrip) => (`
);

export default class CostTpip extends AbstractView{
  constructor(cost) {
    super();
    this._cost = cost;
  }

  getTemplate() {
    return createCostTripTemplate(this._cost);
  }

}
