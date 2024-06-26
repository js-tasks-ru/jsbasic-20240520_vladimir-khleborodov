import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = Math.floor(value);
    
    this._sliderOneSectionWidth = this._calcSliderOneSectionWidth();
    this._sliderStepsThresholds = this._calcSliderStepsThresholds();
    this._slider = this._sliderTemplate();
    this._sliderThumb = this._slider.querySelector('.slider__thumb');
    this._sliderProgress = this._slider.querySelector('.slider__progress');
    
    this._addEventListeners();
  }
  
  get elem() {
    return this._slider;
  }
  
  _calcSliderOneSectionWidth() {
    let sectionWidth = 100 / (this.steps - 1);
    if (this.steps <= 1) return 100;
    
    return sectionWidth;
  }
  
  _calcSliderStepsThresholds() {
    const thresholds = [];
    for (let i = 0; i < this.steps; i++) {
      thresholds.push(this._sliderOneSectionWidth * i);
    }
    
    return thresholds;
  }
  
  _sliderTemplate() {
    const slider = createElement(`
      <div class="slider">
        <!--Ползунок слайдера с активным значением-->
        <div class="slider__thumb">
          <span class="slider__value">${this.value + 1}</span>
        </div>
        
        <!--Полоска слайдера-->
        <div class="slider__progress"></div>
        
        <!-- Шаги слайдера (вертикальные чёрточки) -->
        <div class="slider__steps">
          <!-- текущий выбранный шаг выделен этим классом -->
        </div>
      </div>`
    );
    
    const sliderSteps = slider.querySelector('.slider__steps');
    sliderSteps.append( ...this._renderSteps() );
    
    const sliderProgress = slider.querySelector('.slider__progress');
    sliderProgress.style.width = `${this._sliderOneSectionWidth * this.value}%`;
    
    const sliderThumb = slider.querySelector('.slider__thumb');
    sliderThumb.style.left = `${this._sliderOneSectionWidth * this.value}%`;
    
    return slider;
  }
  
  _renderSteps() {
    const stepsArr = [];
    for (let i = 0; i < this.steps; i++) {
      const step = createElement(`<span></span>`);
      if (i === this.value) step.classList.add('slider__step-active');
      
      stepsArr.push(step);
    }
    return stepsArr;
  }
  
  _calcDynamicWidth = (event) => {
    let dynamicWidth = (event.clientX - this._slider.getBoundingClientRect().left) * 100 / this._slider.offsetWidth;
    if (dynamicWidth < 0) dynamicWidth = 0;
    if (dynamicWidth > 100) dynamicWidth = 100;
    
    return dynamicWidth;
  }
  
  _calcData = (event) => {
    let shiftX = this._calcDynamicWidth(event);
    
    let arr = this._sliderStepsThresholds.slice();
    arr.push(shiftX);
    arr.sort((a, b) => a - b);
    
    let shiftXIndex = arr.indexOf(shiftX);
    let previousSibling = (shiftX !== 0) ? arr[shiftXIndex - 1] : 0;
    let nextSibling = arr[shiftXIndex + 1];
    
    arr.splice(shiftXIndex, 1);
    let previousSiblingIndex = arr.indexOf(previousSibling);
    let nextSiblingIndex = arr.indexOf(nextSibling);
    
    let differenceWithPreviousSibling = shiftX - previousSibling;
    let differenceWithNextSibling = nextSibling - shiftX;
    
    let result = {
      previousSibling,
      previousSiblingIndex,
      nextSibling,
      nextSiblingIndex,
      differenceWithPreviousSibling,
      differenceWithNextSibling
    };
    
    return result;
  }
  
  _calcClosestStep = (event) => {
    const sliderThumb = this._sliderThumb;
    const sliderProgress = this._sliderProgress;
    
    let {
      previousSibling,
      previousSiblingIndex,
      nextSibling,
      nextSiblingIndex,
      differenceWithPreviousSibling,
      differenceWithNextSibling
    } = this._calcData(event);
    
    if (differenceWithPreviousSibling <= differenceWithNextSibling) {
      sliderThumb.style.left = previousSibling + '%';
      sliderProgress.style.width = previousSibling + '%';
      
      this._changeActiveClassAndSliderValue(previousSiblingIndex);
      
    } else {
      sliderThumb.style.left = nextSibling + '%';
      sliderProgress.style.width = nextSibling + '%';
      
      this._changeActiveClassAndSliderValue(nextSiblingIndex);
    }
  }
  
  _changeActiveClassAndSliderValue = (index) => {
    const stepsArr = Array.from(this._slider.querySelector('.slider__steps').children);
    let sliderValue = this._slider.querySelector('.slider__value');
    let sliderStepActive = this._slider.querySelector('.slider__step-active');
    
    sliderStepActive.classList.remove('slider__step-active');
    sliderStepActive = stepsArr[index];
    this.value = index;
    sliderValue.textContent = this.value + 1;
    sliderStepActive.classList.add('slider__step-active');
  }
  
  _onPointerDown = (event) => {
    event.preventDefault();
    const sliderThumb = this._sliderThumb;
    
    sliderThumb.ondragstart = () => false;
    
    sliderThumb.pointerId = 1;
    sliderThumb.setPointerCapture(sliderThumb.pointerId);
    
    sliderThumb.addEventListener('pointermove', this._onPointerMove);
    sliderThumb.addEventListener('pointerup', this._onPointerUp);
  }
  
  _onPointerMove = (event) => {
    event.preventDefault();
    const sliderProgress = this._sliderProgress;
    this._slider.classList.add('slider_dragging');
    
    this._sliderThumb.style.left = this._calcDynamicWidth(event) + '%';
    sliderProgress.style.width = this._calcDynamicWidth(event) + '%';
    
    let {
      previousSiblingIndex,
      nextSiblingIndex,
      differenceWithPreviousSibling,
      differenceWithNextSibling
    } = this._calcData(event);
    
    if (differenceWithPreviousSibling <= differenceWithNextSibling) {
      this._changeActiveClassAndSliderValue(previousSiblingIndex);
    } else {
      this._changeActiveClassAndSliderValue(nextSiblingIndex);
    }
  }
  
  _onPointerUp = (event) => {
    this._sliderThumb.removeEventListener('pointermove', this._onPointerMove);
    this._sliderThumb.removeEventListener('pointerup', this._onPointerUp);
    this._slider.classList.remove('slider_dragging');
    
    this._calcClosestStep(event);
    this._sliderChangeCustomEvent();
  }
  
  _onClick = (event) => {
    let target = event.target;
    if (target.closest('.slider__thumb') || !target.closest('.slider')) return;
    
    this._calcClosestStep(event);
    this._sliderChangeCustomEvent();
  }
  
  _sliderChangeCustomEvent = () => {
    let sliderChangeCustomEvent = new CustomEvent('slider-change', {
      detail: this.value,
      bubbles: true,
      cancelable: true
    });
    
    this._slider.dispatchEvent(sliderChangeCustomEvent);
  }
  
  _addEventListeners() {
    this._sliderThumb.addEventListener('pointerdown', this._onPointerDown);
    this._slider.addEventListener('click', this._onClick);
  }
}
