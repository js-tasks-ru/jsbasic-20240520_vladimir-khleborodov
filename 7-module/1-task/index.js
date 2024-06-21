import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this._ribbonMenu = this._ribbonMenuTemplate();
    this._ribbonMenuInner = this._ribbonMenu.querySelector('.ribbon__inner');
    this._selectedRibbonCategory = null;
    
    this._addEventListeners();
  }
  
  get elem() {
    return this._ribbonMenu;
  }
  
  _ribbonMenuTemplate() {
    const ribbonMenu = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
        
        <nav class="ribbon__inner">
        </nav>
        
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>`
    );
    
    if (this.categories.length !== 0) {
      const ribbonInner = ribbonMenu.querySelector('.ribbon__inner');
      ribbonInner.append( ...this._renderRibbonCategories() );
    }
    
    return ribbonMenu;
  }
  
  _renderRibbonCategories() {
    const categoriesArr = [];
    for (const {name, id} of this.categories) {
      const category = createElement(`<a href="#" class="ribbon__item" data-id="${id}">${name}</a>`);
      categoriesArr.push(category);
    }
    
    return categoriesArr;
  }
  
  _ribbonScroll = (event) => {
    if (event.target.closest('.ribbon__arrow_right')) {
      this._ribbonMenuInner.scrollBy(350, 0);
    }
    
    if (event.target.closest('.ribbon__arrow_left')) {
      this._ribbonMenuInner.scrollBy(-350, 0);
    }
  }
  
  _hideArrows = () => {
    const ribbonArrowLeft = this._ribbonMenu.querySelector('.ribbon__arrow_left');
    const ribbonArrowRight = this._ribbonMenu.querySelector('.ribbon__arrow_right');
    
    let scrollWidth = this._ribbonMenuInner.scrollWidth;
    let scrollLeft = this._ribbonMenuInner.scrollLeft;
    let clientWidth = this._ribbonMenuInner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;
    
    if (scrollRight < 1) {
      ribbonArrowRight.classList.remove('ribbon__arrow_visible');
    } else {
      ribbonArrowRight.classList.add('ribbon__arrow_visible');
    }
    
    if (scrollLeft === 0) {
      ribbonArrowLeft.classList.remove('ribbon__arrow_visible');
    } else {
      ribbonArrowLeft.classList.add('ribbon__arrow_visible');
    }
  }
  
  _selectCategory = (event) => {
    let target = event.target;
    let newCategory = null;
    
    if (!target.closest('.ribbon__item')) return;
    
    event.preventDefault();
    
    if (!this._selectedRibbonCategory) {
      this._selectedRibbonCategory = target;
      this._selectedRibbonCategory.classList.add('ribbon__item_active');
      return;
    }
    
    newCategory = target;
    
    if (newCategory === this._selectedRibbonCategory) return;
    
    this._selectedRibbonCategory.classList.remove('ribbon__item_active');
    this._selectedRibbonCategory = newCategory;
    this._selectedRibbonCategory.classList.add('ribbon__item_active');
  }
  
  _selectCategoryCustomEvent = (event) => {
    const ribbonItem = event.target.closest('.ribbon__item');
    if (ribbonItem) {
      const ribbonSelectEvent = new CustomEvent('ribbon-select', {
      detail: ribbonItem.dataset.id,
      bubbles: true,
      cancelable: true
    });
    
    this._ribbonMenu.dispatchEvent(ribbonSelectEvent);
    }
  }
  
  _addEventListeners() {
    this._ribbonMenu.addEventListener('click', this._ribbonScroll);
    this._ribbonMenu.addEventListener('click', this._selectCategory);
    this._ribbonMenu.addEventListener('click', this._selectCategoryCustomEvent);
    this._ribbonMenuInner.addEventListener('scroll', this._hideArrows);
  }
}
