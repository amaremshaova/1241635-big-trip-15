import AbstractObserver from '../utils/abstract-observer.js';

export default class InfoTrip extends AbstractObserver {
  constructor(infoData) {
    super();
    this._infoData = infoData;
  }

  setInfoData(updateType, infoData) {
    this._infoData = infoData;
    this._notify(updateType);
  }

}
