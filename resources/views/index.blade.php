<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="/css/normalize.css">
    <link rel="stylesheet" href="/css/app.css">
    <link rel="stylesheet" href="/css/variables.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,500&display=swap" rel="stylesheet">

    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <!-- <script async src="https://telegram.org/js/telegram-widget.js?21" 
        data-telegram-login="PulseAppNotifyBot" 
        data-size="large" 
        data-radius="10"
        data-auth-url="https://pulse-back.pisateli-studio.ru/api/v1/telegram/login"
        data-request-access="write">
    </script> -->

    <title>Pulse</title>
    
</head>
<body>
    <div id="app">
    </div>
    <script src="{{ mix('/js/app.js') }}?v=1.0.1"></script>
</body>
</html>