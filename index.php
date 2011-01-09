<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="cs" >
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="content-language" content="cs" />
        <meta name="author" content="Jáchym Toušek" />
        <meta name="copyright" content="2011 Jáchym Toušek" />
        <title>Gomoku</title>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="bookmark icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="stylesheet" type="text/css" media="screen" href="/css/style.css" />
        <script src="/js/jquery-1.4.4.js"></script>
        <script src="/js/class.js"></script>
        <script src="/js/script.js"></script>
    </head>
    <body>
        <div id="new">
            <h1>Nová hra</h1>
            <div class="option">
                <h2>Typ hry</h2>
                <input type="radio" id="form-type" value="0" /><label>hráč vs. počítač</label>
                <input type="radio" id="form-type" value="1" /><label>počítač vs. hráč</label>
                <input type="radio" id="form-type" value="2" /><label>2 hráči</label>
            </div>
            <div class="option">
                <h2>Začínající hráč</h2>
                <input type="radio" id="form-type" value="0" /><label>X</label>
                <input type="radio" id="form-type" value="1" /><label>O</label>
            </div>
            <div class="option">
                <h2>Hardcore</h2>
                <input type="radio" id="form-type" value="0" /><label>Ne</label>
                <input type="radio" id="form-type" value="1" /><label>Ano</label>
            </div>
        </div>
        <div id="game">

        </div>
    </body>
</html>