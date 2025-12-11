-- db/seed.sql
USE dism;

INSERT INTO Usuarios (IdUsuario, Nombre, Usuario, Clave) VALUES
  (1, 'Ana Pérez', 'ana', 'ana123'),
  (2, 'Luis Gómez', 'luis', 'luis123');

INSERT INTO Trabajos (IdTrabajo, Nombre) VALUES
  (10, 'Mantenimiento'),
  (20, 'Desarrollo');

INSERT INTO ApiKey (`Key`) VALUES ('DISM-KEY-123');
