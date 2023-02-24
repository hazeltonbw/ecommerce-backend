module.exports = class mockData {
  // Javascript Private Member Variables defined with #
  // #variableName = type;
  #mockUsers = [];
  #mockCategories = [];
  #mockProducts = [];
  #mockOrders = [];
  #mockCarts = [];
  #mockCartHasProducts = [];
  #mockOrderHasProducts = [];

  // constants
  #AMOUNT_OF_MOCKS;

  constructor() {
    this.#AMOUNT_OF_MOCKS = 15;
  }

  getMockUsers = () => this.#mockUsers;
  getMockCategories = () => this.#mockCategories;
  getMockProducts = () => this.#mockProducts;
  getMockOrders = () => this.#mockOrders;
  getMockCarts = () => this.#mockCarts;
  getMockCartHasProducts = () => this.#mockCartHasProducts;
  getMockOrderHasProducts = () => this.#mockOrderHasProducts;
  getAmountOfMocks = () => this.#AMOUNT_OF_MOCKS;

  createMockUsers = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const user = {
        user_id: i + 1,
        fname: `f${i + 1}`,
        lname: `l${i + 1}`,
        email: `f${i + 1}.l${i + 1}@test.com`,
        password: `password`,
        isadmin: false,
      };

      this.#mockUsers.push(user);
    }

    return this.#mockUsers;
  };

  createMockCategories = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const category = {
        category_id: i + 1,
        name: `Category ${i + 1}`,
      };

      this.#mockCategories.push(category);
    }

    return this.#mockCategories;
  };

  createMockProducts = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const product = {
        product_id: i + 1,
        category_id: 1,
        title: `Pants #${i + 1}`,
        price: 123.45 + i,
        description: `Description ${i + 1}`,
      };

      this.#mockProducts.push(product);
    }

    return this.#mockProducts;
  };

  createMockOrders = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const order = {
        order_id: i + 1,
        user_id: i + 1,
        // yyyy-mm-dd
        // wont work for years past 9999 according to stackoverflow,
        // but im not immortal unfortunately so this'll do
        date: new Date().toISOString(),
        status: "PENDING",
      };

      this.#mockOrders.push(order);
    }

    return this.#mockOrders;
  };

  createMockCarts = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const cart = {
        cart_id: i + 1,
        user_id: i + 1,
        created: new Date().toISOString().substring(0, 10),
        modified: new Date().toISOString().substring(0, 10),
      };

      this.#mockCarts.push(cart);
    }

    return this.#mockCarts;
  };

  createMockCartHasProducts = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const cartHasProduct = {
        cart_id: i + 1,
        product_id: i + 1,
        qty: i + 1,
      };

      this.#mockCartHasProducts.push(cartHasProduct);
    }

    return this.#mockCartHasProducts;
  };

  createMockOrderHasProducts = () => {
    for (let i = 0; i < this.#AMOUNT_OF_MOCKS; i++) {
      const orderHasProduct = {
        order_id: i + 1,
        product_id: i + 1,
        qty: i + 1,
      };

      this.#mockOrderHasProducts.push(orderHasProduct);
    }

    return this.#mockOrderHasProducts;
  };
};
