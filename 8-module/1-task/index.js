import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetWidth && !this.elem.offsetHeight) return;
    
    let htmlClientWidth = document.documentElement.clientWidth;
    const firstContainer = document.querySelector('.container');
    let firstContainerWidth = firstContainer.offsetWidth;
    let oneMarginWidth = (htmlClientWidth - firstContainerWidth) / 2;
    
    const distanceFromFirstContainer = 20;
    const distanceFromWindowRightEdge = 10;
    const cartIconWidth = this.elem.offsetWidth;
    
    if (window.scrollY >= 50) {
      this.elem.style.position = 'fixed';
      this.elem.style.top = '50px';
      this.elem.style.left = (oneMarginWidth > cartIconWidth + distanceFromFirstContainer + distanceFromWindowRightEdge) ?
      `${oneMarginWidth + firstContainerWidth + distanceFromFirstContainer}px` :
      `${htmlClientWidth - cartIconWidth - distanceFromWindowRightEdge}px`;
      this.elem.style.zIndex = '999';
      return;
    }
    
    this.elem.style.position = '';
    this.elem.style.top = '';
    this.elem.style.left = '';
    this.elem.style.zIndex = '';
    
  }
}
