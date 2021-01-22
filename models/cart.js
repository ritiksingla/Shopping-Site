module.exports = class Cart {
  constructor(props) {
    if (!props) {
      this.products = {};
      this.totalQuantity = 0;
      this.totalPrice = 0;
    } else {
      this.products = props.products;
      this.totalQuantity = props.totalQuantity;
      this.totalPrice = props.totalPrice;
    }
  }
  add(product, productId) {
    if (!this.products[productId]) {
      this.products[productId] = { product: product, qty: 0, price: 0 };
    }
    this.products[productId].qty++;
    this.products[productId].price =
      this.products[productId].product.price * this.products[productId].qty;
    this.totalQuantity++;
    this.totalPrice += this.products[productId].product.price;
  }

  deleteOne(product, productId) {
    this.products[productId].qty--;
    this.totalQuantity--;
    const productPrice = this.products[productId].product.price;
    this.totalPrice -= productPrice;
    if (this.products[productId].qty === 0) {
      delete this.products[productId];
    } else {
      this.products[productId].price -= productPrice;
    }
  }
};
