-- db/schema.sql
CREATE DATABASE IF NOT EXISTS dism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dism;

CREATE TABLE IF NOT EXISTS Usuarios (
  IdUsuario INT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Usuario VARCHAR(50),
  Clave   VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Trabajos (
  IdTrabajo INT PRIMARY KEY,
  Nombre VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS Fichajes (
  IdFichaje INT PRIMARY KEY AUTO_INCREMENT,
  FechaHoraEntrada DATETIME,
  FechaHoraSalida  DATETIME,
  HorasTrabajadas  INT,
  IdTrabajo INT,
  IdUsuario INT,
  GeolocalizacionLatitud  FLOAT,
  GeolocalizacionLongitud FLOAT
);

CREATE TABLE IF NOT EXISTS ApiKey (
  idKey INT PRIMARY KEY AUTO_INCREMENT,
  `Key` VARCHAR(50) NOT NULL
);
