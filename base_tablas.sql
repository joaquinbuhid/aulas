CREATE DATABASE AULAS
USE AULAS
CREATE TABLE aula(
id_aula INT IDENTITY(1,1) PRIMARY KEY,
nombre VARCHAR(30),
edificio_id INT,
capacidad INT,
detalles VARCHAR(50))
CREATE TABLE edificio(
id_edificio INT IDENTITY(1,1) PRIMARY KEY,
nombre VARCHAR(30))
CREATE TABLE movimientos(
id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
aula_id INT,
fecha_desde DATE,
fecha_hasta DATE,
materia VARCHAR(30),
carrera VARCHAR(30),
docente VARCHAR(30))
CREATE TABLE encargados(
id_encargado INT IDENTITY(1,1) PRIMARY KEY,
nombre VARCHAR(30),
apellido VARCHAR(30),
hora_desde TIME,
hora_hasta TIME)
CREATE TABLE ingresos(
id_ingreso INT IDENTITY(1,1) PRIMARY KEY,
encargado_id INT,
fecha_ingreso DATE)