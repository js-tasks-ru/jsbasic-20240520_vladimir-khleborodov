import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    
    this.render();
  }
  
  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>`
    );
    
    this.renderCards();
  }

  renderCards() {
    const productGridInner = this.elem.querySelector('.products-grid__inner');
    productGridInner.innerHTML = '';
    for (const product of this.products) {
      if (this.filters.noNuts && product.nuts) continue;
      if (this.filters.vegeterianOnly && !product.vegeterian) continue;
      if (product.spiciness !== 0 && product.spiciness > this.filters.maxSpiciness) continue;
      if (this.filters.category && this.filters.category !== product.category) continue;
      
      const productCard = new ProductCard(product);
      productGridInner.append(productCard.elem);
    }
  }
  
  updateFilter(filters) {
    Object.assign(this.filters, filters);
    this.renderCards();
  }
}
