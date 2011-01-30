/**
 * Rozměry hracího plánu.
 *
 * @todo rozdělit na SIZE_X a SIZE_Y
 * @const
 */
var SIZE = 19;



/**
 * Reprezentuje hrací plán.
 *
 * @class
 */
var Game = $class({

    /**
     * @access public
     * @return void
     */
    constructor: function () {
        this.coords = [];
        for (var i = 0; i < SIZE; i++) {
            this.coords[i] = [];
            for (var j = 0; j < SIZE; j ++) {
                this.coords[i][j] = null;
            }
        }
    },

    /**
     * Řekne aktuálnímu hráči, že je na tahu.
     *
     * @access public
     * @return void
     */
    run: function () {
        if (this.actual) this.actual.move();
    },

    /**
     * Ověří, zda souřadnice jsou na hracím plánu.
     *
     * @access public
     * @param int
     * @param int
     * @return bool
     */
    isValidCoords: function (x, y) {
        return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
    },

    /**
     * Zjistí, který hráč má svůj symbol na daných souřadnicích.
     *
     * @access public
     * @param int
     * @param int
     * @return Player|null
     */
    getCoords: function (x, y) {
        return this.coords[x][y];
    },

    /**
     * Ověří platnost tahu a případný konec hry.
     *
     * @access public
     * @return void
     */
    tryMove: function (player, x, y) {
        if (this.actual != player || !this.isValidCoords(x, y) || this.getCoords(x, y) != null) return;
        this.setCoords(x, y, player);
        if (player == this.player1) this.actual = this.player2;
        else this.actual = this.player1;

        var i, j,
            directions = [];

        // vítězsví?
        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y) && this.getCoords(x - i, y) == player) i++;
        while (this.isValidCoords(x + j, y) && this.getCoords(x + j, y) == player) j++;
        if (i + j == 6) {
            directions.push(1); // -
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x, y - i) && this.getCoords(x, y - i) == player) i++;
        while (this.isValidCoords(x, y + j) && this.getCoords(x, y + j) == player) j++;
        if (i + j == 6) {
            directions.push(2); // |
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y - i) && this.getCoords(x - i, y - i) == player) i++;
        while (this.isValidCoords(x + j, y + j) && this.getCoords(x + j, y + j) == player) j++;
        if (i + j == 6) {
            directions.push(3); // \
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y + i) && this.getCoords(x - i, y + i) == player) i++;
        while (this.isValidCoords(x + j, y - j) && this.getCoords(x + j, y - j) == player) j++;
        if (i + j == 6) {
            directions.push(4); // /
        }

        if (directions.length) {
            this.victory(x, y, directions);
        }

        // remíza?
        var full = true;
        for (i = 0; i < SIZE; i++) {
            for (j = 0; j < SIZE; j ++) {
                if (this.getCoords(i, j) == null) full = false;
            }
        }
        if (full) {
            this.draw();
            return;
        }

        var player = this;
        // další tah
        setTimeout(function () {
            player.run();
        }, 500);
    },

    /**
     * Umístí hráčův symbol na dané pole.
     *
     * @access private
     * @param int
     * @param int
     * @param Player
     */
    setCoords: function (x, y, player) {
        this.coords[x][y] = player;
        $('#game td.last').removeClass('last');
        var field = this.getField(x, y);
        if (player.image) {
            field.addClass('cross');
        } else {
            field.addClass('circle');
        }
        field.addClass('last');
    },

    /**
     * Najde pole v DOM.
     *
     * @access private
     * @param int
     * @param int
     * @return jQuery
     */
    getField: function (x, y) {
        return $('#game tr:eq(' + y + ') > td:eq(' + x +')');
    },

    /**
     * Zvýrazní výtězné pětice.
     *
     * @access private
     * @param int
     * @param int
     * @param array
     * @return void
     */
    victory: function(x, y, directions) {
        var i, j,
            player = this.getCoords(x, y);
        for (key in directions) {
            i = 1;
            j = 1;
            switch (directions[key]) {
                case 1: // -
                    while (this.isValidCoords(x - i, y) && this.getCoords(x - i, y) == player) this.getField(x - i++, y).addClass('victorious');
                    while (this.isValidCoords(x + j, y) && this.getCoords(x + j, y) == player) this.getField(x + j++, y).addClass('victorious');
                    break;
                case 2: // |
                    while (this.isValidCoords(x, y - i) && this.getCoords(x, y - i) == player) this.getField(x, y - i++).addClass('victorious');
                    while (this.isValidCoords(x, y + j) && this.getCoords(x, y + j) == player) this.getField(x, y + j++).addClass('victorious');
                    break;
                case 3: // \
                    while (this.isValidCoords(x - i, y - i) && this.getCoords(x - i, y - i) == player) this.getField(x - i, y - i++).addClass('victorious');
                    while (this.isValidCoords(x + j, y + j) && this.getCoords(x + j, y + j) == player) this.getField(x + j, y + j++).addClass('victorious');
                    break;
                case 4: // /
                    while (this.isValidCoords(x - i, y + i) && this.getCoords(x - i, y + i) == player) this.getField(x - i, y + i++).addClass('victorious');
                    while (this.isValidCoords(x + j, y - j) && this.getCoords(x + j, y - j) == player) this.getField(x + j, y - j++).addClass('victorious');
                    break;
            }
        }
        this.getField(x, y).addClass('victorious');
        this.end();
    },

    /**
     * Hra skončila remízou.
     *
     * @access private
     * @return void
     */
    draw: function() {
        this.end();
    },

    /**
     * Konec hry, zvýrazní odkaz na novou hru.
     *
     * @access private
     * @return void
     */
    end: function() {
        this.actual = null;
        $('#reset').addClass('highlight');
    },

});



/**
 * Reprezentuje hráče.
 *
 * @class
 * @abstract
 */
var Player = $class({

    /**
     * @access public
     * @return void
     */
    constructor: function (game, image) {
        this.game = game;
        this.image = image;
    },

    /**
     * Hráč je na tahu.
     *
     * @access public
     * @return void
     */
    move: function () {},

});



/**
 * Lidský hráč.
 *
 * @class
 */
var Human = $class({

    Extends: Player,

    /**
     * Nastaví všem hracím polím událost onclick.
     *
     * @access public
     * @return void
     */
    constructor: function() {
        Player.apply(this, arguments);
        (function (player) {
            $('#game td').click(function () {
                var x = $(this).prevAll().size(),
                    y = $(this).parent().prevAll().size();
                player.game.tryMove(player, x, y);
            });
        })(this);
    },

});



/**
 * Virtuální hráč.
 *
 * @class
 */
var Computer = $class({

    Extends: Player,

    /**
     * @access public
     * @return void
     */
    constructor: function () {
        Player.apply(this, arguments);
    },

    /**
     * Vybere nejlepší pole a provede tah.
     *
     * @access public
     * @return void
     */
    move: function () {
        var now,
            top = 0,
            fields = [];
        for (var i = 0; i < SIZE; i++) {
            for (var j = 0; j < SIZE; j++) {
                if (this.game.getCoords(i, j) != null) continue;
                now = this.scoreField(i, j);
                if (top < now) {
                    top = now;
                    fields = [];
                    fields.push([i, j]);
                }
                if (top == now) {
                    fields.push([i, j]);
                }
            }
        }
        // z nejlepších vyber náhodné
        var move = fields[Math.floor(Math.random() * fields.length)];
        this.game.tryMove(this, move[0], move[1]);
    },

    /**
     * Ohodnotí pole.
     *
     * @access private
     * @param int
     * @param int
     * @return int
     */
    scoreField: function (x, y) {
        var score = 0;
        for (var i = 1; i <= 4; i++) {
            score += this.scoreDirection(x, y, i);
        }
        return score;
    },

    /**
     * Ohodnotí pole v jednom směru.
     *
     * @access private
     * @param int
     * @param int
     * @param int
     * @return int
     */
    scoreDirection: function (x, y, direction) {
        var dx, dy;
        switch (direction) {
            case 1: // -
                dx = 1;
                dy = 0;
                break;
            case 2: // |
                dx = 1;
                dy = 1;
                break;
            case 3: // \
                dx = -1;
                dy = 1;
                break;
            case 4: // /
                dx = 0;
                dy = 1;
                break;
        }
        var score = 0,
            self, opponent, valid,
            tx, ty, i, j;
        for (i = 1; i <= 5; i++) {
            self = 0;
            opponent = 0;
            valid = true;
            // kolik symbolů v dané pětici mám já a kolik má soupeř
            for (j = 1; j <= 5; j++) {
                tx = x + (i + j - 6) * dx;
                ty = y + (i + j - 6) * dy;
                // dostali jsme se mimo hrací plán
                if (!this.game.isValidCoords(tx, ty))
                    valid = false;
                else if (this.game.getCoords(tx, ty) == this)
                    self++;
                else if (this.game.getCoords(tx, ty) != null)
                    opponent++;
            }
            if (!valid) continue;
            if (opponent > 0 && self == 0)
                // soupeř zde může vyhrát
                score += this.scoreDefense(opponent);
            else if (self > 0 && opponent == 0)
                // já zde mohu vyhrát
                score += this.scoreAttack(self);
            else if (self == 0 && opponent == 0)
                // nikdo zde nemůže vyhrát
                score++;
        }
        return score;
    },

    /**
     * Útočná hodnota.
     *
     * @access private
     * @param int
     * @return int
     */
    scoreAttack: function (count) {
        switch (count) {
            case 1: return 10;
            case 2: return 100;
            case 3: return 2000;
            case 4: return 50000;
            default: return 0;
        }
    },

    /**
     * Obranná hodnota.
     *
     * @access private
     * @param int
     * @return int
     */
    scoreDefense: function (count) {
        switch (count) {
            case 1: return 20;
            case 2: return 200;
            case 3: return 1000;
            case 4: return 10000;
            default: return 0;
        }
    },

});



// DOM je připraven
$(function () {

    $('#play').click(function () {

        // zjištění hodnot z formuláře
        var type = $('input:radio[name=type]:checked').val();
        var image = $('input:radio[name=image]:checked').val() == 0;

        // vytvoření objektů
        var game = new Game();
        var player1, player2;
        if (type == 0) {
            player1 = new Human(game, image);
            player2 = new Computer(game, !image);
        } else if (type == 1) {
            player1 = new Computer(game, image);
            player2 = new Human(game, !image);
        } else if (type == 2) {
            player1 = new Human(game, image);
            player2 = new Human(game, !image);
        } else {
            throw 'Unknown game type.';
        }
        game.player1 = player1;
        game.player2 = player2;
        // začínající hráč
        game.actual = player1;

        // zobrazení herního plánu
        $('#reset').removeClass('highlight');
        $('#new').css('display', 'none');
        $('#game').css('display', 'block');
        $('#game .victorious').removeClass('victorious');

        // spuštění hry
        game.run();

    });

});
