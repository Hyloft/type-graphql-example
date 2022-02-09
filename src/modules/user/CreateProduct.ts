import { Product } from './../../entity/Product';
import { createResolver } from './generics/CreateGeneric';
import { ProductInput } from './product/ProductInput';


export const CreateProductResolver = createResolver(
    "Product",
    Product,
    ProductInput,
    Product
);