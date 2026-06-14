<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

esciUtente();

header('Location: login.php?messaggio=logout');
exit;
