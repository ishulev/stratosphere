<?php
$contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
$to = "ivan.venelinov.shulev@gmail.com";

if (strpos($contentType, "application/json") !== false) {
    //Receive the RAW post data.
    $content = trim(file_get_contents("php://input"));

    $decoded = json_decode($content, true);

    //If json_decode failed, the JSON is invalid.
    if (!is_array($decoded)) {

    } else {
        $name = isset($decoded['name']) ? $decoded['name'] : '';
        $email = isset($decoded['email']) ? $decoded['email'] : '';
        $subject = isset($decoded['subject']) ? $decoded['subject'] : '';
        $message = isset($decoded['message']) ? $decoded['message'] : '';

        //Sanitize input data using PHP filter_var().
        $name = filter_var(trim($name), FILTER_SANITIZE_STRING);
        $subject = filter_var(trim($subject), FILTER_SANITIZE_STRING);
        $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
        $message = filter_var(trim($message), FILTER_SANITIZE_STRING);

        //additional php validation
        if (strlen($name) < 3) { // If length is less than 4 it will throw an HTTP error.
            $output = json_encode(array('type' => 'error', 'text' => 'Name is too short!'));
            die($output);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { //email validation
            $output = json_encode(array('type' => 'error', 'text' => 'Please enter a valid email!'));
            die($output);
        }
        if (strlen($message) < 5) { //check emtpy message
            $output = json_encode(array('type' => 'error', 'text' => 'Too short message!'));
            die($output);
        }

        if (!$subject) {
            $subject = "Contact from website";
        }

        $headers = 'From: ' . $email . '' . "\r\n" .
        'Reply-To: ' . $email . '' . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
        mail($to, $subject, $message, $headers);
        $output = json_encode(array('type' => 'success', 'text' => 'Mail sent!'));
        die($output);
    }
} else if (
    $_POST &&
    isset($_POST['submit'], $_POST['name'], $_POST['email'], $_POST['subject'], $_POST['message']) &&
    !empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['message'])
) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    if (!$subject) {
        $subject = "Contact from website";
    }

    $headers = 'From: ' . $email . '' . "\r\n" .
    'Reply-To: ' . $email . '' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $message, $headers);
    exit;
}
