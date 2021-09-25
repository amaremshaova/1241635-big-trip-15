import SortView from '../view/sort.js';
import InfoTripView from '../view/info-trip.js';
import {sortPointTime, sortPointPrice, sortPointDay} from '../utils/point.js';
import NoPointView from '../view/no-point.js';
import PointListView from '../view/point-list.js';
import PointPresenter, {State as PointPresenterViewState} from './point.js';
import PointNewPresenter from './point-new.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {SortType, UpdateType, UserAction, FilterType} from '../const.js';
import LoadingView from '../view/loading.js';
import {filter} from '../utils/filter.js';
import {getCostTrip} from '../utils/get-cost.js';

export default class Trip {
  constructor(tripContainer, pointsModel, filterModel, api, addPointButton) {

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._tripContainer = tripContainer;
    this._addPointButton = addPointButton;

    this._pointPresenter = new Map();
    this._filterType = FilterType.EVERYTHING;

    this._currentSortType = SortType.DAY;
    this._isLoading = false;
    this._api = api;


    this._sortComponent = null;
    this._infoTripComponent = null;
    this._noPointComponent = null;

    this._pointListComponent = new PointListView();
    this._noPointComponent = new NoPointView(this._filterType);
    this._loadingComponent = new LoadingView();

    this._getDestinations = this._getDestinations.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  _getOffers() {
    return this._pointsModel.getOffers();
  }

  _getDestinations() {
    return this._pointsModel.getDestinations();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filtredPoints = filter[this._filterType](points);


    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortPointTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortPointPrice);
      case SortType.DAY:
        return filtredPoints.sort(sortPointDay);
    }

    return filtredPoints;
  }

  _getCities(destinations){
    return destinations.map((item) => item.name);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._pointListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(newPointButton) {
    this._newPointButton = newPointButton;
    const noPointElement = this._tripContainer.querySelector('.trip-events__msg');
    if (noPointElement !== null) {
      replace(this._pointListComponent, this._noPointComponent);
    }
    this._pointNewPresenter.init(newPointButton, this._destinations, this._offers, this._cities);
  }

  _parseInfoData(points) {

    const isManyCities = points.length > 3 ? 'true' : 'false';
    const cities = [];
    cities[0] = points[points.length - 1].destination.name;
    cities[1] = points[0].destination.name;
    return {
      isManyCities: isManyCities,
      cities: !isManyCities ? points.map((point) => point.destination.name) : cities,
      startDate: points.length !== 0 ? points[points.length - 1].dateFrom : '',
      endDate: points.length !== 0 ? points[0].dateTo : '',
      cost: points.length !== 0 ? getCostTrip(points) : '',
    };
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {

      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();

        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderInfo(){
    if (this._infoTripComponent !== null) {
      this._infoTripComponent = null;
    }

    this._infoTripComponent = new InfoTripView(this._infoData);

    const headerMainElement = document.querySelector('.trip-main');
    render(headerMainElement, this._infoTripComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point){

    const pointPresenter = new PointPresenter(this._pointListComponent,
      this._handleViewAction, this._handleModeChange, this._addPointButton);
    pointPresenter.init(point, this._destinations, this._offers, this._cities);

    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoPoints() {
    this._noPointComponent = new NoPointView(this._filterType);
    render(this._tripContainer, this._noPointComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip(resetSortType = false) {

    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);

    if (this._noPointComponent) {
      remove(this._noPointComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._destinations = this._getDestinations();
    this._offers = this._getOffers();
    this._cities = this._getCities(this._destinations);

    const points = this._getPoints();
    const pointCount = points.length;

    if (pointCount === 0) {
      remove(this._sortComponent);
      remove(this._infoTripComponent);

      if (this._noPointComponent) {
        remove(this._noPointComponent);
      }
      this._renderNoPoints();
      return;
    }

    this._infoData = this._parseInfoData(points);
    this._renderInfo();

    this._renderSort();
    render(this._tripContainer, this._pointListComponent, RenderPosition.BEFOREEND);
    this._renderPoints(points);

  }
}
