# API Documentation

| URL | METHOD | ACTION |
| ------ | ------ | ------ |
| /products | GET | Returns ALL products |
| /products/:productId | GET | Returns a SINGLE product |
| [/products](#createProductSchema) | POST | Create a product |
| /products/:productId | DELETE | Deletes a product |


# CreateProductSchema example
to add a product pass the following data:
``` json
{
    "title": "new product",
    "description": "product description",
    "price": 1000
}
```
the response will be:
``` json
{
    "title": "new product",
    "description": "product description",
    "price": 1000,
    "count": 0
}
```
it will automatically add ```count: 0``` value if you don't provide it in the request