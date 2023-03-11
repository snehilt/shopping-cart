let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("cartData")) || [];

const getData = () => {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((res) => {
      console.log("res: ", res);
      generateShop(res);
    });
};

getData();
console.log("basket: ", basket);
const generateShop = (product) => {
  return (shop.innerHTML = product
    .map((item) => {
      let { id, name, image, description, price } = item;
      let quantityExists = basket.find((product) => product.id == id);
      console.log("fdd", quantityExists);
      return `
        <div id=product-id-${id} class="item">
            <img width="220" src=${image} alt="">
            <div class="details">
                <h3>${name}</h3>
                <p>${description}</p>
                <div class="price-quantity">
                    <h2>Rs ${price}</h2>
                    <div class="buttons">
                        <i onClick="decrement(${id})" class="bi bi-dash-lg"></i>
                        <div id=${id} class="quantity">${
        quantityExists === undefined ? 0 : quantityExists.item
      }
                        </div>
                        <i onClick="increment(${id})" class="bi bi-plus-lg"></i>
                    </div>
                </div>
            </div>
        </div>
        `;
    })
    .join(""));
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
  localStorage.setItem("cartData", JSON.stringify(basket));
};

const update = (id) => {
  let itemToUpdate = basket.find((item) => item.id == id);
  console.log("inside update", itemToUpdate);
  document.getElementById(id).innerHTML = itemToUpdate.item;
  calculateCartCount();
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

calculateCartCount();
