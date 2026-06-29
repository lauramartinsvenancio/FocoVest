<?php
mb_internal_encoding('UTF-8');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';

$pdo    = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;

function jsonOut($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    switch ($method) {

        case 'GET':
            if (isset($_GET['stats'])) {
                $stmt  = $pdo->query("SELECT COUNT(*) AS total, SUM(status = 'Revisado') AS reviewed FROM subjects");
                $stats = $stmt->fetch();
                jsonOut([
                    'total'    => (int) $stats['total'],
                    'reviewed' => (int) ($stats['reviewed'] ?? 0)
                ]);
            }

            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM subjects WHERE id = ?");
                $stmt->execute([$id]);
                $subject = $stmt->fetch();
                if (!$subject) {
                    jsonOut(['error' => 'Subject not found'], 404);
                }
                jsonOut($subject);
            }

            $q = isset($_GET['q']) ? trim($_GET['q']) : '';
            if ($q !== '') {
                $like = "%{$q}%";
                $stmt = $pdo->prepare("SELECT * FROM subjects WHERE title LIKE ? OR discipline LIKE ? ORDER BY created_at DESC");
                $stmt->execute([$like, $like]);
            } else {
                $stmt = $pdo->query("SELECT * FROM subjects ORDER BY created_at DESC");
            }
            jsonOut($stmt->fetchAll());
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['title']) || empty($data['discipline']) || empty($data['study_date'])) {
                jsonOut(['error' => 'title, discipline and study_date are required'], 400);
            }

            $stmt = $pdo->prepare(
                "INSERT INTO subjects (title, discipline, study_date, status, notes) VALUES (?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $data['title'],
                $data['discipline'],
                $data['study_date'],
                $data['status'] ?? 'Pendente',
                $data['notes']  ?? ''
            ]);

            $newId = $pdo->lastInsertId();
            $stmt  = $pdo->prepare("SELECT * FROM subjects WHERE id = ?");
            $stmt->execute([$newId]);
            jsonOut($stmt->fetch(), 201);
            break;

        case 'PUT':
            if (!$id) {
                jsonOut(['error' => 'id is required'], 400);
            }

            $data = json_decode(file_get_contents('php://input'), true);

            if (empty($data['title']) || empty($data['discipline']) || empty($data['study_date'])) {
                jsonOut(['error' => 'title, discipline and study_date are required'], 400);
            }

            $stmt = $pdo->prepare(
                "UPDATE subjects SET title = ?, discipline = ?, study_date = ?, status = ?, notes = ? WHERE id = ?"
            );
            $stmt->execute([
                $data['title'],
                $data['discipline'],
                $data['study_date'],
                $data['status'] ?? 'Pendente',
                $data['notes']  ?? '',
                $id
            ]);

            $stmt = $pdo->prepare("SELECT * FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            jsonOut($stmt->fetch());
            break;

        case 'PATCH':
            if (!$id) {
                jsonOut(['error' => 'id is required'], 400);
            }

            $stmt = $pdo->prepare(
                "UPDATE subjects SET status = IF(status = 'Revisado', 'Pendente', 'Revisado') WHERE id = ?"
            );
            $stmt->execute([$id]);

            $stmt = $pdo->prepare("SELECT * FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            jsonOut($stmt->fetch());
            break;

        case 'DELETE':
            if (!$id) {
                jsonOut(['error' => 'id is required'], 400);
            }

            $stmt = $pdo->prepare("DELETE FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            jsonOut(['success' => true]);
            break;

        default:
            jsonOut(['error' => 'Method not allowed'], 405);
    }
} catch (PDOException $e) {
    jsonOut(['error' => $e->getMessage()], 500);
}

