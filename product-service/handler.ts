import 'source-map-support/register';

import { getProductsList } from './handlers/getProductsList';
import { getProductsById } from './handlers/getProductsById';
import { createProduct } from './handlers/createProduct';
import { deleteProduct } from './handlers/deleteProduct';

export { getProductsList, getProductsById, createProduct, deleteProduct };
