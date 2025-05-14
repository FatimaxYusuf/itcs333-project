<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

require_once '../../connection.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (!isset($_GET['news_id'])) {
    http_response_code(400);
    echo json_encode([ 'error' => 'Missing news_id' ]);
    exit;
  }

  $stmt = $pdo->prepare("SELECT * FROM comments WHERE news_id = ? ORDER BY created_at DESC");
  $stmt->execute([ $_GET['news_id'] ]);
  echo json_encode($stmt->fetchAll());

} else if ($method === 'POST') {
  $input = json_decode(file_get_contents("php://input"), true);

  if (!isset($input['news_id'], $input['text'])) {
    http_response_code(400);
    echo json_encode([ 'error' => 'Missing fields' ]);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO comments (news_id, text) VALUES (?, ?)");
  $stmt->execute([ $input['news_id'], $input['text'] ]);

  echo json_encode([ 'message' => 'Comment added successfully.' ]);

} else if ($method === 'DELETE') {
  parse_str($_SERVER["QUERY_STRING"], $query);

  if (!isset($query['id'])) {
    http_response_code(400);
    echo json_encode([ 'error' => 'Comment ID is required for deletion.' ]);
    exit;
  }

  $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
  $stmt->execute([ $query['id'] ]);

  echo json_encode([ 'message' => 'Comment deleted successfully.' ]);

} else {
  http_response_code(405);
  echo json_encode([ 'error' => 'Method not allowed.' ]);
}
