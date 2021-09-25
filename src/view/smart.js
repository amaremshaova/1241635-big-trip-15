import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdating) {

    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    prevElement.replaceWith(newElement);

    this.restoreHandlers();

  }


  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
