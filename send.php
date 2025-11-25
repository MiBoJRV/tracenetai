<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ret_code' => '405',
        'ret_message' => 'Method not allowed'
    ]);
    exit;
}

$input = file_get_contents('php://input');
$data = [];

if (!empty($input)) {
    parse_str($input, $data);
}

$requiredFields = ['FirstName', 'Email', 'PhoneNumber'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    http_response_code(400);
    echo json_encode([
        'ret_code' => '400',
        'ret_message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit;
}

$page = $data['Page'] ?? 'ICO-CA';
$config = [
    'ApiKey' => 'TVRVMk9EWmZOelkyWHpFMU5qZzJYdz09',
    'ApiPassword' => '2kEOSzYg5F',
    'CampaignID' => '20499'
];


$apiData = [
    'ApiKey' => $config['ApiKey'],
    'ApiPassword' => $config['ApiPassword'],
    'CampaignID' => $config['CampaignID'],
    'FirstName' => trim($data['FirstName'] ?? ''),
    'LastName' => trim($data['LastName'] ?? ''),
    'Email' => trim($data['Email'] ?? ''),
    'PhoneNumber' => preg_replace('/\s+/', '', trim($data['PhoneNumber'] ?? '')),
    'Page' => $page,
    'Description' => $data['Description'] ?? 'Contact form submission'
];

$requestBody = http_build_query($apiData);

$ch = curl_init('https://tracker.pablos.team/repost.php?act=register');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestBody);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'ret_code' => '500',
        'ret_message' => 'Connection error: ' . $curlError
    ]);
    exit;
}

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode([
        'ret_code' => (string)$httpCode,
        'ret_message' => 'Server error occurred'
    ]);
    exit;
}

$responseData = json_decode($response, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        'ret_code' => '500',
        'ret_message' => 'Invalid response from server'
    ]);
    exit;
}

http_response_code(200);
echo json_encode($responseData);

