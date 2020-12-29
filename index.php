<?php

//echo __DIR__;

require_once __DIR__ . '/lib/lessc.inc.php';
require_once __DIR__ . '/lib/Less.php';

$less = new Less('./less/style.less', './css/style.css');
$less->imgPath = '/images/';
$less->compile(__DIR__ . '/less');

?><!DOCTYPE html>
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
        <link rel="stylesheet" type="text/css" media="screen" href="./css/style.css" />
        <script src="./js/head.js"></script>
        <script>
            head.js('./js/jquery-1.4.4.js', './js/class.js', './js/script.js');
        </script>
    </head>
    <body>

        <div id="new">
            <h1>New game</h1>
            <div class="option">
                <h2>Game type</h2>
                <input type="radio" name="type" id="form-type-0" value="0" checked="checked" /><label for="form-type-0">player vs. computer</label>
                <input type="radio" name="type" id="form-type-1" value="1" /><label for="form-type-1">computer vs. player </label>
                <input type="radio" name="type" id="form-type-2" value="2" /><label for="form-type-2">2 player</label>
            </div>
            <div class="option begin">
                <h2>Beginner player</h2>
                <input type="radio" name="image" id="form-image-0" value="0" checked="checked" /><label for="form-image-0"><img src="./img/cross.png" alt="X" title="cross" /></label>
                <input type="radio" name="image" id="form-image-1" value="1" /><label for="form-image-1"><img src="./img/circle.png" alt="O" title="circle" /></label>
            </div>
            <input type="submit" id="play" value="Start the game">
        </div>

        <div id="game">
            <table>
                <tbody>
                    <?php
                        for ($i = 0; $i < 19; $i++) {
                            echo "<tr>\n";
                            for ($j = 0; $j < 19; $j++) {
                                echo "<td></td>\n";
                            }
                            echo "</tr>\n";
                        }
                    ?>
                </tbody>
            </table>

            <a id="reset" href="./">New Game</a>
        </div>

    </body>
</html>