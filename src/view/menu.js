import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => (`<nav class="trip-controls__trip-tabs  trip-tabs">
                <a class="trip-tabs__btn  trip-tabs__btn--active"
                name=${MenuItem.TABLE} href="#">Table</a>
                <a class="trip-tabs__btn "
                name=${MenuItem.STATS} href="#">Stats</a>
              </nav>`);

export default class Menu extends AbstractView {

  constructor(currentItemMenu) {
    super();
    this._currentItemMenu = currentItemMenu;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _replaceMenuItem(evt){
    let prevElement;
    let newElement;

    const menuElements = this.getElement().querySelectorAll('.trip-tabs__btn');
    if (menuElements[0].classList.contains('trip-tabs__btn--active'))
    {
      prevElement = menuElements[0];
      newElement =  menuElements[1];
    }
    else{
      prevElement = menuElements[1];
      newElement =  menuElements[0];
    }

    if (this._currentItemMenu !== evt.target.name){
      this._currentItemMenu = evt.target.name;
      prevElement.classList.remove('trip-tabs__btn--active');
      newElement.classList.add('trip-tabs__btn--active');
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._replaceMenuItem(evt);
    this._callback.menuClick(evt.target.name);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().querySelectorAll('.trip-tabs__btn').forEach((item) =>
      item.addEventListener('click', this._menuClickHandler));
  }

  setMenuItem() {
    //const item = this.getElement().querySelector(`[name=${menuItem}]`);

  }
}
