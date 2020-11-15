CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  price integer
);

CREATE TABLE IF NOT EXISTS stocks (
  product_id uuid,
  count integer,
  foreign key ("product_id") references "products" ("id")
);

-- INSERT INTO products (title, description, price) values
-- ('Lost Uber Driver XL surfboard 6ft 2 FCS II - White', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 1000),
-- ('Lib Tech x Lost Hydra surfboard 5ft 11 - Red', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 999),
-- ('Firewire Helium Dominator 2.0 surfboard 6ft 2 FCS II - White', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 1100),
-- ('Lost Pro-Formance Driver 2.0 surfboard 6ft 0 FCS II - White', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 400),
-- ('Lost Cobra Killer surfboard 5ft 7 Futures - Tan', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 1000),
-- ('Channel Islands Mid surfboard 7ft 2 FCS II - Turquoise Resin Tint', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,', 300)
-- RETURNING *;

-- INSERT INTO stocks (product_id, count) values
-- ('79b79e25-8217-4f36-b82b-9968d1a3fc6c', 5),
-- ('e01fb797-2320-4928-b060-f331fe20d055', 2),
-- ('81a489db-aa45-478a-b27e-81ed752fd7df', 1),
-- ('8bbf9402-0ebe-45a8-a3b0-82bc61f488a1', 10),
-- ('ad86edee-96b0-4994-944a-34b9dd249dc1', 11),
-- ('d0b399f6-02e9-48c9-a3d4-4c7eb49e7fe6', 9);

-- SELECT * FROM products;
-- SELECT * FROM stocks;

-- SELECT id, count, price, title, description FROM products
-- INNER JOIN stocks s ON (products.id = s.product_id AND s.count > 0);

-- DROP TABLE products;
-- DROP TABLE stocks;
