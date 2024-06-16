import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this._carousel = this._carouselTemplate();
    this._counter = 0;
    this._dynamicSlideWidth = 0;
    
    this._addEventListeners();
  }
  
  get elem() {
    return this._carousel;
  }
  
  _carouselTemplate() {
    const carousel = createElement(`
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left" style="display: none">
          <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
      </div>`
    );
    
    carousel.append( this._carouselInnerContent() );
    return carousel;
  }
  
  _carouselInnerContent() {
    const carouselInner = createElement('<div class="carousel__inner"></div>');
    
    for (const {image, price, name, id} of this.slides) {
      const carouselSlide = createElement(`
        <div class="carousel__slide" data-id="${id}">
          <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${price.toFixed(2)}</span>
            <div class="carousel__title">${name}</div>
            <button type="button" class="carousel__button">
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>`
      );
      
      carouselInner.append(carouselSlide);
    }
    
    return carouselInner;
  }
  
  _arrowSwitch = (event) => {
    const carouselArrowRight = this._carousel.querySelector('.carousel__arrow_right');
    const carouselArrowLeft = this._carousel.querySelector('.carousel__arrow_left');
    const carouselInner = this._carousel.querySelector('.carousel__inner');
    const carouselSlidesArr = Array.from(carouselInner.children);
    let target = event.target;
    
    if (target.closest('.carousel__arrow_right')) {
      this._counter++;
      if (this._counter === carouselSlidesArr.length - 1) carouselArrowRight.style.display = 'none';
      
      carouselArrowLeft.style.display = '';
      this._dynamicSlideWidth += carouselSlidesArr[this._counter].offsetWidth;
      carouselInner.style.transform = `translateX(-${this._dynamicSlideWidth}px)`;
    }
    
    if (target.closest('.carousel__arrow_left')) {
      this._counter--;
      if (this._counter === 0) carouselArrowLeft.style.display = 'none';
      
      carouselArrowRight.style.display = '';
      this._dynamicSlideWidth -= carouselSlidesArr[this._counter].offsetWidth;
      carouselInner.style.transform = `translateX(-${this._dynamicSlideWidth}px)`;
    }
  }
  
  _productAddFromSlide = (event) => {
    if (event.target.closest('.carousel__button')) {
      const slide = event.target.closest('.carousel__slide');
      
      const productAddFromSlideEvent = new CustomEvent('product-add', {
        detail: slide.dataset.id,
        bubbles: true,
        cancelable: true
      });
      
      this._carousel.dispatchEvent(productAddFromSlideEvent);
    }
  }
  
  _addEventListeners() {
    this._carousel.addEventListener('click', this._arrowSwitch);
    this._carousel.addEventListener('click', this._productAddFromSlide);
  }
}
