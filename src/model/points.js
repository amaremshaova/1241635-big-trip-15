import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
    this._destinations = [];
    this._offers = [];
  }

  setOffers( offers) {
    //console.log(offers)
    this._offers = offers.slice();
    //this._notify(updateType);
  }

  getOffers() {
    return this._offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();


    //this._notify(updateType);
  }

  getDestinations() {
    console.log(this);
    return this._destinations;
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        isFavorite: point['is_favorite'],
        basePrice: point['base_price'],
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }

  static adaptToServer(point) {

    console.log(point.dateFrom.toISOString());
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.dateFrom.toISOString(),
        'date_to': point.dateTo.toISOString(),
        'is_favorite': point.isFavorite,
        'base_price': point.basePrice,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.basePrice;

    return adaptedPoint;
  }
}
