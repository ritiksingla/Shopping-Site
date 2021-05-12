module.exports = class Cart {
  constructor(props) {
    if (!props) {
      this.products = {};
      this.totalQuantity = 0;
      this.totalPrice = 0;
    } else {
      this.products = props.products;
      this.totalQuantity = props.totalQuantity;
      this.totalPrice = parseFloat(props.totalPrice);
    }
  }
  add(product, productId) {
    if (!this.products[productId]) {
      this.products[productId] = { product: product, qty: 0, price: 0 };
    }
    this.products[productId].qty++;
    this.products[productId].price =
      parseFloat(this.products[productId].product.price) *
      this.products[productId].qty;
    this.products[productId].price = parseFloat(
      this.products[productId].price
    ).toFixed(2);
    this.totalQuantity++;
    this.totalPrice += this.products[productId].product.price;
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
  }

  deleteOne(product, productId) {
    this.products[productId].qty--;
    this.totalQuantity--;
    let productPrice = parseFloat(this.products[productId].product.price);
    this.totalPrice -= productPrice;
    this.totalPrice = parseFloat(this.totalPrice).toFixed(2);
    if (this.products[productId].qty === 0) {
      delete this.products[productId];
    } else {
      this.products[productId].price -= productPrice;
      this.products[productId].price = parseFloat(
        this.products[productId].price
      ).toFixed(2);
    }
  }
};
