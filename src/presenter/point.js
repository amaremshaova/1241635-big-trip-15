import {render, RenderPosition, replace, remove} from '../utils/render.js';
import PointView from '../view/point-trip';
import PointEditView from '../view/point-edit.js';
import {UserAction, UpdateType} from '../const.js';
import { isPointFuture, isPointPast } from '../utils/point.js';
import {isOnline} from '../utils/common.js';
import {toast} from '../utils/toast.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init(point, destinations, offers, cities) {
    this._point = point;
    this._offers = offers;
    this._destinations = destinations;
    this._cities = this.uniqueCities(cities);
    this._handleCloseClick = this._handleCloseClick.bind(this);

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, this._destinations, this._offers, this._cities, this._handleCloseClick);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setCloseClickHandler(this._handleCloseClick);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);

   /* console.log('ПРОШЛО');
    if (this._mode === Mode.DEFAULT) {
      //render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      replace(this._pointComponent, prevPointComponent);
      console.log('ПРОШЛО');

    }

    console.log('ПРОШЛО');

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
    }

    console.log('ПРОШЛО');

    if (prevPointComponent !== null)
    remove(prevPointComponent);

    if (prevPointEditComponent !== null)
    remove(prevPointEditComponent);
*/

  }

  uniqueCities(cities){
    const set = new Set(cities);
    return Array.from(set);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }


  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _handleCloseClick() {
    //this._pointEditComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _replaceCardToForm() {
    replace(this._pointEditComponent, this._pointComponent);

    document.addEventListener('keydown', this._escKeyDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._handleCloseClick(evt);
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
    if (!isOnline()) {
      toast('You can\'t edit point offline');
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleFormSubmit(update) {

    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    const isMinorUpdate =
      isPointFuture(this._point.dateFrom, this._point.dateTo) !== isPointFuture(update.dateFrom, update.dateTo)
      ||  isPointPast(this._point.dateFrom, this._point.dateTo) !== isPointPast(update.dateFrom, update.dateTo);

    this._replaceFormToCard();
    this._changeData( UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update);

  }

  _handleDeleteClick(point) {

    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
