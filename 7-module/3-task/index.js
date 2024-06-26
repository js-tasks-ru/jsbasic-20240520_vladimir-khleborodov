export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = Math.floor(value);
    
    this._sliderSectionWidth = this._calcSliderOneSectionWidth();
    this._sliderStepsThresholds = this._calcSliderStepsThresholds();
    this._slider = this._sliderTemplate();
    
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
      thresholds.push(this._sliderSectionWidth * i);
    }
    
    return thresholds;
  }
  
  _sliderTemplate() {
    const slider = document.createElement('div');
    slider.classList.add('slider');
    slider.insertAdjacentHTML('afterbegin', `
      <!--Ползунок слайдера с активным значением-->
      <div class="slider__thumb">
        <span class="slider__value">${this.value}</span>
      </div>
      
      <!--Полоска слайдера-->
      <div class="slider__progress"></div>
      
      <!-- Шаги слайдера (вертикальные чёрточки) -->
      <div class="slider__steps">
        <!-- текущий выбранный шаг выделен этим классом -->
      </div>`
    );
    
    const sliderSteps = slider.querySelector('.slider__steps');
    sliderSteps.append( ...this._renderSteps() );
    
    const sliderProgress = slider.querySelector('.slider__progress');
    sliderProgress.style.width = `${this._sliderSectionWidth * this.value}%`;
    
    const sliderThumb = slider.querySelector('.slider__thumb');
    sliderThumb.style.left = `${this._sliderSectionWidth * this.value}%`;
    
    return slider;
  }
  
  _renderSteps() {
    const stepsArr = [];
    for (let i = 0; i < this.steps; i++) {
      const step = document.createElement(`span`);
      if (i === this.value) step.classList.add('slider__step-active');
      
      stepsArr.push(step);
    }
    return stepsArr;
  }
  
  _changeActiveClassAndSliderValue = (index) => {
    const stepsArr = Array.from(this._slider.querySelector('.slider__steps').children);
    let sliderValue = this._slider.querySelector('.slider__value');
    let sliderStepActive = this._slider.querySelector('.slider__step-active');
    
    sliderStepActive.classList.remove('slider__step-active');
    sliderStepActive = stepsArr[index];
    this.value = index;
    sliderValue.textContent = this.value;
    sliderStepActive.classList.add('slider__step-active');
  }
  
  _setClosestStep = (event) => {
    let target = event.target;
    const sliderThumb = this._slider.querySelector('.slider__thumb');
    const sliderProgress = this._slider.querySelector('.slider__progress');
    
    if (!target.closest('.slider')) return;
    
    let shiftX = (event.clientX - this._slider.getBoundingClientRect().left) * 100 / this._slider.offsetWidth;
    if (shiftX < 0) shiftX = 0;
    if (shiftX > 100) shiftX = 100;
    
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
  
  _sliderChangeCustomEvent = () => {
    let sliderChangeCustomEvent = new CustomEvent('slider-change', {
      detail: this.value, // значение 0, 1, 2, 3, 4
      bubbles: true,
      cancelable: true
    });
    
    this._slider.dispatchEvent(sliderChangeCustomEvent);
  }
  
  _addEventListeners() {
    this._slider.addEventListener('click', this._setClosestStep);
    this._slider.addEventListener('click', this._sliderChangeCustomEvent);
  }
}
