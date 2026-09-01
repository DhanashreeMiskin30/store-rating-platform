-- =========================================================
-- Store Rating Platform - Database Schema
-- =========================================================

CREATE DATABASE IF NOT EXISTS store_rating
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  

USE store_rating;

-- ---------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(60)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  address       VARCHAR(400) DEFAULT NULL,
  role          ENUM('SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER') NOT NULL DEFAULT 'NORMAL_USER',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_users_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
  CONSTRAINT chk_users_address_length CHECK (address IS NULL OR CHAR_LENGTH(address) <= 400)
) ENGINE=InnoDB;

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_users_role ON users (role);

-- ---------------------------------------------------------
-- Table: stores
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS stores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) DEFAULT NULL,
  address     VARCHAR(400) DEFAULT NULL,
  owner_id    INT DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_stores_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_stores_name ON stores (name);
CREATE INDEX idx_stores_email ON stores (email);
CREATE INDEX idx_stores_owner_id ON stores (owner_id);

-- ---------------------------------------------------------
-- Table: ratings
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  store_id    INT NOT NULL,
  rating      TINYINT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_ratings_store FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE,
  CONSTRAINT uq_ratings_user_store UNIQUE (user_id, store_id),
  CONSTRAINT chk_ratings_range CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB;

CREATE INDEX idx_ratings_store_id ON ratings (store_id);
CREATE INDEX idx_ratings_user_id ON ratings (user_id);

-- =========================================================
-- Seed data
-- Password for every seeded user is:  StrongPass@123
-- Hash generated with bcryptjs (10 salt rounds)
-- =========================================================

INSERT INTO users (name, email, password_hash, address, role) VALUES
('System Administrator Account One', 'admin@storerating.com', '$2b$10$jnF2qC5L3aQiCTwYRPXbcO0kXVX4mnR1l8EgQ3ldJL89NOOrYemOG', 'Head Office, MG Road, Pune', 'SYSTEM_ADMIN'),
('Rajesh Kumar Normal User Account', 'rajesh.kumar@example.com', '$2b$10$jnF2qC5L3aQiCTwYRPXbcO0kXVX4mnR1l8EgQ3ldJL89NOOrYemOG', 'Flat 12, FC Road, Pune', 'NORMAL_USER'),
('Sunita Sharma Normal User Account', 'sunita.sharma@example.com', '$2b$10$jnF2qC5L3aQiCTwYRPXbcO0kXVX4mnR1l8EgQ3ldJL89NOOrYemOG', 'Plot 45, Baner Road, Pune', 'NORMAL_USER'),
('Amit Patel Store Owner Account One', 'amit.patel@example.com', '$2b$10$jnF2qC5L3aQiCTwYRPXbcO0kXVX4mnR1l8EgQ3ldJL89NOOrYemOG', 'Shop 3, JM Road, Pune', 'STORE_OWNER'),
('Priya Verma Store Owner Account Two', 'priya.verma@example.com', '$2b$10$jnF2qC5L3aQiCTwYRPXbcO0kXVX4mnR1l8EgQ3ldJL89NOOrYemOG', 'Shop 8, Karve Road, Pune', 'STORE_OWNER');

INSERT INTO stores (name, email, address, owner_id) VALUES
('ABC Electronics Store', 'contact@abcelectronics.com', 'Shop 3, JM Road, Pune', 4),
('Fresh Mart Groceries', 'info@freshmart.com', 'Shop 8, Karve Road, Pune', 5);

INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 4),
(3, 1, 5),
(2, 2, 3);
