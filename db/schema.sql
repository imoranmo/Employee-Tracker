DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE categories(
  id INT NOT NULL,
  category_name VARCHAR(30) NOT NULL
);