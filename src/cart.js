let basket = JSON.parse(localStorage.getItem("cartData")) || [];
let label = document.getElementById("label");
let ShoppingCart = document.getElementById("shopping-cart");
let products = [];

console.log("basket val in cart.js: ", basket);

const getProductData = () => {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((res) => {
      console.log("res: ", res);
      generateCartItems(res);
      billAmount(res);
      //   generateShop(res);
    });
};

const calculateCartCount = () => {
  let total = 0;
  let cartIcon = document.getElementById("cartAmount");
  basket.map((product) => {
    return (total = total + product.item);
  });
  cartIcon.innerHTML = total;
  console.log("calc running..", total);
};

const increment = (id) => {
  let selectedItem = id;
  let isItemExists = basket.find((item) => item.id == selectedItem);

  if (isItemExists) {
    isItemExists.item += 1;
  } else {
    basket.push({
      id: selectedItem,
      item: 1,
    });
  }

  update(id);
  getProductData();
  localStorage.setItem("cartData", JSON.stringify(basket));
};

const decrement = (id) => {
  let selectedItem = id;
  let isItemExists = basket.find((item) => item.id == selectedItem);

  if (isItemExists === undefined) return;
  else if (isItemExists.item === 0) return;
  else {
    isItemExists.item -= 1;
  }

  update(id);
  basket = basket.filter((product) => product.item !== 0);
  getProductData();
  localStorage.setItem("cartData", JSON.stringify(basket));
};

const update = (id) => {
  let itemToUpdate = basket.find((item) => item.id == id);
  console.log("inside update", itemToUpdate);
  document.getElementById(id).innerHTML = itemToUpdate.item;
  calculateCartCount();
};

const billAmount = (data) => {
  console.log("search: ", data);
  if (basket.length) {
    let total = basket
      .map((product) => {
        console.log("search: ", product);
        let { id, item } = product;
        let search =
          data.find((item) => {
            console.log("item: ", item);
            console.log("item: ", item.id);
            console.log("item: ", product.id);
            return item.id == id;
          }) || [];
        return item * search.price;
      })
      .reduce((x, y) => x + y, 0);
    console.log("search: ", total);
    //   .reduce((x, y) => x + y, 0);
    label.innerHTML = `
    <h2>Total Bill : Rs ${total}</h2>
    <button class="checkout">Checkout</button>
    <button onClick="clearCart()" class="removeAll">Clear Cart</button>
    `;
  }
};

const removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((product) => product.id !== selectedItem);
  localStorage.setItem("cartData", JSON.stringify(basket));
  window.location.reload();
  //   getProductData();
  console.log("select: ", selectedItem);
  calculateCartCount();
};

const clearCart = () => {
  let basket = [];
  localStorage.setItem("cartData", JSON.stringify(basket));
  calculateCartCount();
};

const generateCartItems = (data) => {
  console.log("data", data);
  console.log("basket: ", basket);
  //   billAmount(data);
  if (basket.length) {
    return (ShoppingCart.innerHTML = basket
      .map((cartItem) => {
        let { id, item } = cartItem;
        let cartItemData = data.find((product) => product.id === id) || [];
        console.log("cart data: ", cartItemData);
        return `
        <div class="cart-item">
        <img width="100px" src=${cartItemData.image} alt="" />
        <div class="details">
        <div class="title-price-x">
        <h4 class="title-price">
        <p>${cartItemData.name}</p>
        <p class="cart-item-price">Rs ${cartItemData.price}</p>
        </h4>
        <i onClick="removeItem(${id})" class="bi bi-x-lg"></i>
        </div>
        <div class="buttons">
            <i onClick="decrement(${id})" class="bi bi-dash-lg"></i>
            <div id=${id} class="quantity">${item}</div>
            <i onClick="increment(${id})" class="bi bi-plus-lg"></i>
        </div>
        <h3>Rs ${item * cartItemData.price}</h3>
        </div>
        </div>
        `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = ``;
    label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
        <button class="HomeBtn">Keep Shopping</button>
    </a>
    `;
  }
};

getProductData();
calculateCartCount();

console.log("last: ", products);
