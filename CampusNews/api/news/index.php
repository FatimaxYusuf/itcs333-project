<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require_once '../../connection.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (isset($_GET['id'])) {
    $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
    $stmt->execute([$_GET['id']]);
    $item = $stmt->fetch();
    echo json_encode($item ?: []);
  } else {
    $stmt = $pdo->query("SELECT * FROM news");
    $items = $stmt->fetchAll();
    echo json_encode($items);
  }

} else if ($method === 'POST') {
  $input = json_decode(file_get_contents("php://input"), true);

  if (!isset($input['title'], $input['college'], $input['date'], $input['summary'], $input['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO news (title, college, date, summary, content, image) VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->execute([
    $input['title'],
    $input['college'],
    $input['date'],
    $input['summary'],
    $input['content'],
    $input['image'] ?? ''
  ]);

  echo json_encode(['message' => 'News created successfully.']);

} else if ($method === 'PUT') {
  parse_str($_SERVER["QUERY_STRING"], $query);
  $input = json_decode(file_get_contents("php://input"), true);

  if (!isset($query['id'], $input['title'], $input['college'], $input['date'], $input['summary'], $input['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields.']);
    exit;
  }

  $stmt = $pdo->prepare("UPDATE news SET title = ?, college = ?, date = ?, summary = ?, content = ?, image = ? WHERE id = ?");
  $stmt->execute([
    $input['title'],
    $input['college'],
    $input['date'],
    $input['summary'],
    $input['content'],
    $input['image'] ?? '',
    $query['id']
  ]);

  echo json_encode(['message' => 'News updated successfully.']);

} else if ($method === 'DELETE') {
  $id = $_GET['id'] ?? null;

  if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID is required for deletion.']);
    exit;
  }

  $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
  $stmt->execute([$id]);

  echo json_encode(['message' => 'News deleted successfully.']);
} else {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed.']);
}
