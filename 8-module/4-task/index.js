import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;
    
    let cartItem = this.cartItems.find(item => item.product.id === product.id);
    if (cartItem) {
      cartItem.count++;
    } else {
      cartItem = {
        'product': product,
        'count': 1
      }
      
      this.cartItems.push(cartItem);
    }
    
    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => item.product.id === productId);
    let index = this.cartItems.indexOf(cartItem);
    cartItem.count += amount;
    
    if (cartItem.count === 0) this.cartItems.splice(index, 1);
    
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((sum, item)=> sum + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((sum, item)=> sum + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modalWindow = new Modal();
    this.modalWindow.setTitle('Your order');
    
    this.modalBody = createElement(`<div></div>`);
    this.cartItems.forEach(item => {
      let product = this.renderProduct(item.product, item.count);
      this.modalBody.append(product);
    });
    
    let orderForm = this.renderOrderForm();
    this.modalBody.append(orderForm);
    this.modalWindow.setBody(this.modalBody);
    
    this.modalBody.addEventListener('click', this.onClick);
    this.modalBody.querySelector('.cart-form').addEventListener('submit', this.onSubmit);
  }

  onClick = (event) => {
    let target = event.target;
    if (!target.closest('.cart-counter__button')) return;
    
    let productId = target.closest('.cart-product').dataset.productId;
    
    if (target.closest('.cart-counter__button_minus')) {
      this.updateProductCount(productId, -1);
    }
    
    if (target.closest('.cart-counter__button_plus')) {
      this.updateProductCount(productId, 1);
    };
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
    
    if (!document.body.classList.contains('is-modal-open')) return;
    
    let productId = cartItem.product.id;
    let productCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
    let productPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
    let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`);
    
    productCount.innerHTML = cartItem.count;
    
    let modalBodyProductsList = Array.from(this.modalBody.querySelectorAll('.cart-product'));
    if (modalBodyProductsList.length === 1 && productCount.innerHTML === '0') {
      this.modalWindow.close();
      this.modalBody.removeEventListener('click', this.onClick);
      this.modalBody.querySelector('.cart-form').removeEventListener('submit', this.onSubmit);
    }
    
    if (productCount.innerHTML === '0') {
      let cartProduct = this.modalBody.querySelector(`[data-product-id="${productId}"]`);
      cartProduct.remove();
    }
    
    productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
  }

  onSubmit = async (event) => {
    event.preventDefault();
    
    let submitOrderForm = this.modalBody.querySelector('.cart-form');
    let submitFormButton = this.modalBody.querySelector('button[type="submit"]');
    submitFormButton.classList.add('is-loading');
    
    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(submitOrderForm)
    });
    
    if (response.ok) {
      this.modalWindow.setTitle('Success!');
      submitFormButton.classList.remove('is-loading');
      this.cartItems = [];
      this.cartIcon.update(this);
      
      this.modalBody.innerHTML = `
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :) <br>
            We’ll notify you about delivery time shortly.<br>
            <img src="/assets/images/delivery.gif">
          </p>
        </div>`;
        
      this.modalBody.removeEventListener('click', this.onClick);
      submitOrderForm.removeEventListener('submit', this.onSubmit);
    }
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

