-- FocoVest Database Setup
-- Execute this in phpMyAdmin or MySQL CLI

CREATE DATABASE IF NOT EXISTS focovest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE focovest;

CREATE TABLE IF NOT EXISTS subjects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  discipline  VARCHAR(100) NOT NULL,
  study_date  DATE NOT NULL,
  status      ENUM('Pendente', 'Revisado') NOT NULL DEFAULT 'Pendente',
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sample data
INSERT INTO subjects (title, discipline, study_date, status, notes) VALUES
  ('Funções quadráticas', 'Matemática', '2026-06-29', 'Pendente', 'Revisar fórmula de Bhaskara e vértice da parábola.'),
  ('Revolução Francesa', 'História', '2026-06-28', 'Revisado', 'Causas, fases da revolução e consequências para a Europa.'),
  ('Citologia: organelas', 'Biologia', '2026-06-30', 'Pendente', 'Mitocôndria, complexo de Golgi, retículo endoplasmático e ribossomos.'),
  ('Ecologia: ciclos biogeoquímicos', 'Biologia', '2026-08-22', 'Pendente', 'Ciclo do carbono, nitrogênio e água. Impacto humano nos ciclos.');
