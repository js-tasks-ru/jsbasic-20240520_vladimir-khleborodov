import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this._modal = this._modalTemplate();
    
    this.setTitle();
    this.setBody();
    this.open();
    
    this._addEventListeners();
  }
  
  _modalTemplate() {
    const modal = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
        
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>`
    );
    
    return modal;
  }
  
  setTitle(modalTitle) {
    const title = this._modal.querySelector('.modal__title');
    title.textContent = modalTitle;
  }
  
  setBody(node) {
    const modalBody = this._modal.querySelector('.modal__body');
    modalBody.innerHTML = '';
    modalBody.append(node);
  }
  
  open() {
    document.body.prepend(this._modal);
    document.body.classList.add('is-modal-open');
  }
  
  close() {
    this._modal.remove();
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', this._closeWithKeyESC);
  }
  
  _closeWithButton = (event) => {
    let target = event.target;
    if (this._modal.contains(target) && target.closest('.modal__close')) {
      this.close();
    }
  }
  
  _closeWithKeyESC = (event) => {
    if (event.code === 'Escape') this.close();
  }
  
  _addEventListeners() {
    this._modal.addEventListener('click', this._closeWithButton);
    document.addEventListener('keydown', this._closeWithKeyESC);
  }
}
