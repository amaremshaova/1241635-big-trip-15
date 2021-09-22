import InfoTripView from '../view/info-trip';
import CostTripView from '../view/cost-trip';
import { RenderPosition } from '../utils/render';
import { getCostTrip } from '../utils/get-cost';
import { render } from '../utils/render';

export default class InfoTrip {
  constructor(infoTripContainer, pointsModel) {
    this._pointsModel = pointsModel;
    this._infoTripContainer = infoTripContainer;

  }

  init(){
    this._infoData = this._createInfoData(this._pointsModel.getPoints());

    this._infoTripComponent = new InfoTripView(this._infoData);
    this._costTripComponent = new CostTripView(this._infoData.cost);
  }

  _clearInfoTrip() {
    this.updateElement();
  }

  renderInfoTrip() {

    render(infoSectionElement, this._infoTripComponent, RenderPosition.BEFOREEND);
    render(infoSectionElement, this._costTripComponent, RenderPosition.BEFOREEND);
    render(this._infoTripContainer, infoSectionElement, RenderPosition.AFTERBEGIN);
  }

}
