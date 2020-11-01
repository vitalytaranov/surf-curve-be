import products from '../db/products';

export function getAllProducts() {
  return new Promise((resolve) => {
    resolve(products)
  });
}

export function getProductById(id) {
  return new Promise((resolve, reject) => {
    if (id) {
      const product = products.find(product => product.id === Number(id));
      resolve(product);
    } else {
      reject();
    }
  });
}
