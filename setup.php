<?php
header('Content-Type: text/plain; charset=utf-8');

try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec("SET NAMES utf8mb4");

    $pdo->exec("CREATE DATABASE IF NOT EXISTS focovest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE focovest");

    $pdo->exec("DROP TABLE IF EXISTS subjects");
    $pdo->exec("CREATE TABLE subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        discipline VARCHAR(100) NOT NULL,
        study_date DATE NOT NULL,
        status ENUM('Pendente','Revisado') NOT NULL DEFAULT 'Pendente',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $pdo->exec("INSERT INTO subjects (title, discipline, study_date, status, notes) VALUES
        ('Fun" . "\xc3\xa7\xc3\xb5" . "es quadr" . "\xc3\xa1" . "ticas', 'Matem" . "\xc3\xa1" . "tica', '2026-06-29', 'Pendente', 'Revisar f" . "\xc3\xb3" . "rmula de Bhaskara e v" . "\xc3\xa9" . "rtice da par" . "\xc3\xa1" . "bola.'),
        ('Revolu" . "\xc3\xa7\xc3\xa3" . "o Francesa', 'Hist" . "\xc3\xb3" . "ria', '2026-06-28', 'Revisado', 'Causas, fases da revolu" . "\xc3\xa7\xc3\xa3" . "o e consequ" . "\xc3\xaa" . "ncias para a Europa.'),
        ('Citologia: organelas', 'Biologia', '2026-06-30', 'Pendente', 'Mitoc" . "\xc3\xb4" . "ndria, complexo de Golgi, ret" . "\xc3\xad" . "culo endoplasm" . "\xc3\xa1" . "tico e ribossomos.'),
        ('Ecologia: ciclos biogeoqu" . "\xc3\xad" . "micos', 'Biologia', '2026-08-22', 'Pendente', 'Ciclo do carbono, nitrog" . "\xc3\xaa" . "nio e " . "\xc3\xa1" . "gua. Impacto humano nos ciclos.')
    ");

    $rows = $pdo->query("SELECT id, title, discipline FROM subjects")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo "ERRO: " . $e->getMessage();
}
