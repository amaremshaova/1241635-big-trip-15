import dayjs from 'dayjs';
import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import { replacer } from '../utils/limit.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { getOffersArray, getDestinationsArray } from '../utils/point.js';


const createPointEditOffersTemplate = (offers, isOffers, offersMain, isDisabled) =>{
  const titles = offers.map((offer) => offer.title);
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offersMain.map((offer, index) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}"
        type="checkbox" name="event-offer-${index}"
        ${titles.includes(offer.title) && titles.length !== 0 ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''} >
        <label class="event__offer-label" for="event-offer-${index}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`).join('')}
    </div></section>`;
};


const createPointEditDestinationTemplate = (destination, isDestination, isPictures) =>
  `${isDestination ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
      ${destination.description}</p>
      ${isPictures ? `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.pictures.map((photo) =>`<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('')}
      </div>
    </div>` : ''}
    </section>`  : ''}`;


const createEditingFormTemplate = (point, cities, offersMain) => {

  const {type,
    offers,
    dateFrom,
    dateTo,
    basePrice,
    destination,
    isOffers,
    isDestination,
    isPictures,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const offersTemplate = createPointEditOffersTemplate(offers, isOffers, offersMain, isDisabled);
  const destinationTemplate = createPointEditDestinationTemplate(destination, isDestination, isPictures);

  const deleteString = isDeleting ? 'Deleting...' : 'Delete';

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper"  ${isDisabled ? 'disabled' : ''}>
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1"
      ${isDisabled ? 'disabled' : ''}
      type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type"

            value="taxi" ${type === 'taxi' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--taxi" data-type="taxi" for="event-type-taxi-1">Taxi</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--bus" data-type="bus" for="event-type-bus-1">Bus</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--train" data-type="train" for="event-type-train-1">Train</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--ship" data-type="ship" for="event-type-ship-1">Ship</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--drive" data-type="drive" for="event-type-drive-1">Drive</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--flight" data-type="flight" for="event-type-flight-1">Flight</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--check-in" data-type="check-in" for="event-type-check-in-1">Check-in</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--sightseeing" data-type="sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
          </div>

          <div class="event__type-item">
            <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--restaurant" data-type="restaurant" for="event-type-restaurant-1">Restaurant</label>
          </div>
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1"
      type="text" name="event-destination"
      ${isDisabled ? 'disabled' : ''}
      value="${isDestination ? destination.name : cities[0]}"
      list="destination-list-1">
      <datalist class="destination-list" id="destination-list-1">
      ${cities.map((city) => `<option class="destination-list__option" value="${city}">${city}</option>`).join('')}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time event__input--start-time" id="event-start-time-1" type="text"
      name="event-start-time"
      ${isDisabled ? 'disabled' : ''}
      value='${dayjs(dateFrom).format('YYYY/MM/DD HH:mm')}'>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time event__input--end-time" id="event-end-time-1" type="text"
      name="event-end-time"
      ${isDisabled ? 'disabled' : ''}
       value='${dayjs(dateTo).format('YYYY/MM/DD HH:mm')}'>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" pattern="\d+" step="1" name="event-price"
      ${isDisabled ? 'disabled' : ''}
      value=${basePrice}>
    </div>

    <button class="event__save-btn  btn  btn--blue"
    type="submit"
    ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>

    <button class="event__reset-btn"
    type="reset"
    ${isDisabled ? 'disabled' : ''}>
        ${isDestination ?  deleteString: 'Cancel'}
    </button>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
  ${offersTemplate}
  ${destinationTemplate}
  </section>
</form></li>`;
};


export default class PointEdit extends SmartView {
  constructor(point, destinationsAll, offersAll, citiesAll, callbackClose) {
    super();

    this._currentCity = point.destination.name;
    this._data = PointEdit.parsePointToData(point);
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._callbackClose = callbackClose;

    this._offers = offersAll;
    this._destinations = destinationsAll;
    this._cities = citiesAll;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._priceToggleHandler = this._priceToggleHandler.bind(this);

    this._offersToggleHandler = this._offersToggleHandler.bind(this);
    this._dateToLimitHandler = this._dateToLimitHandler.bind(this);

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCloseClickHandler = this._formCloseClickHandler.bind(this);
   // this._showCitiesListHandler = this._showCitiesListHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    const offersTypeMain = getOffersArray(this._offers, this._data.type);
    return createEditingFormTemplate(this._data, this._cities, offersTypeMain );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setDatepicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    if (this._data.dateFrom) {
      this._dateFromPicker = flatpickr(
        this.getElement().querySelector('.event__input--start-time'),
        {
          enableTime: true,
          dateFormat: 'Y/m/d H:i',
          defaultDate: this._data.dataFrom,
          onChange: this._dataFromChangeHandler, // На событие flatpickr передаём наш колбэк
        },
      );

      this._dateToPicker = flatpickr(
        this.getElement().querySelector('.event__input--end-time'),
        {
          enableTime: true,
          dateFormat: 'Y/m/d H:i',
          defaultDate: this._data.dataTo,
          onChange: this._dataToChangeHandler, // На событие flatpickr передаём наш колбэк
        },
      );
    }
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _setInnerHandlers() {
    const collectionTypeElements = this.getElement().querySelectorAll('.event__type-label');
    collectionTypeElements.forEach((item) => item.addEventListener('click', this._typeToggleHandler));

    const collectionDestinationElements = this.getElement().querySelector('.event__input--destination');
    collectionDestinationElements.addEventListener('change', this._destinationToggleHandler);

    const priceInputElement = this.getElement().querySelector('.event__input--price');
    priceInputElement.addEventListener('change', this._priceToggleHandler);

    const collectionOffersElements = this.getElement().querySelectorAll('.event__offer-checkbox');
    collectionOffersElements.forEach((item) => item.addEventListener('change', this._offersToggleHandler));

    const dateToElement = this.getElement().querySelector('.event__input--end-time');

    dateToElement.addEventListener('change', this._dateToLimitHandler);
  }

  _dateToLimitHandler(evt){
    const dateFromElement = this.getElement().querySelector('.event__input--start-time');

    if (dayjs(evt.target.value) < dayjs(dateFromElement.value)){
      evt.target.value = dateFromElement.value;
      evt.target.style.border = 'solid 2px red';
      evt.target.style.backgroundColor = '#FFB6C1';
    }
    else {
      evt.target.style.border = 'none';
      evt.target.style.backgroundColor = 'white';
    }
  }

  _typeToggleHandler(evt) {

    const offersType = getOffersArray(this._offers, evt.target.dataset.type);

    this.updateData({
      type: evt.target.dataset.type,
      offers: [],
      isOffers: offersType.length !== 0 ,
    });
    this.setCloseClickHandler(this._callbackClose);

  }

  _offersToggleHandler(evt) {
    evt.target.checked = !evt.target.checked;
    const parent = evt.target.parentNode;
    const label = parent.querySelector('.event__offer-label');
    const titleData = label.querySelector('.event__offer-title').innerHTML;
    const priceData = label.querySelector('.event__offer-price').innerHTML;

    if (!evt.target.checked){
      this._data.offers.push({title: titleData, price: priceData});

      this.updateData({
        offers :  this._data.offers,
      });
    }
    else {

      this._data.offers.filter((offer) => titleData !== offer.title);
      this.updateData({
        offers : this._data.offers.filter((offer) => titleData !== offer.title),
      });
    }
    this.setCloseClickHandler(this._callbackClose);
  }

  _destinationToggleHandler(evt) {
    let destination = getDestinationsArray(this._destinations, evt.target.value);
    if (destination === undefined) {
      destination = getDestinationsArray(this._destinations, this._currentCity);
    }

    this._currentCity = destination.name;
    this.updateData({
      destination: destination,
      isDestination: destination.length !== 0,
      isPictures: destination.pictures.length !== 0,
    });

    this.setCloseClickHandler(this._callbackClose);
  }

  _priceToggleHandler(evt) {
    evt.preventDefault();
    replacer(evt.target);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isOffers: point.offers.length !== 0,
        isDestination: point.destination.length !== 0,
        isPictures: point.destination.length !== 0 && point.destination.pictures.length !== 0,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    if (!data.isOffers) {
      data.offers = [];
    }

    if (!data.isDestination) {
      data.destination = [];
    }

    if (!data.isPictures) {
      data.destination.pictures = [];
    }

    delete data.isOffers;
    delete data.isPictures;
    delete data.isDestination;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  removeElement() {
    super.removeElement();
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  _formCloseClickHandler(evt){
    evt.preventDefault();
    this._callback.closeClick(evt);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCloseClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  reset(point) {
    this.updateData(
      PointEdit.parsePointToData(point),
    );
  }

}
