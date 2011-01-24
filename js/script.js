/**
 * @class
 */
var Game = class({

    /**
     * @return void
     */
    constructor: function () {
        this.coords = [];
        for (var i = 0; i < 15; i++) {
            this.coords[i] = [];
            for (var j = 0; j < 15; j ++) {
                this.coords[i][j] = null;
            }
        }
    },

    /**
     * @param int
     * @param int
     */
    getField: function (x, y) {
        return $('#game tr:eq(' + y + ') > td:eq(' + x +')');
    },

    /**
     * @param int
     * @param int
     */
    isValidCoords: function (x, y) {
        return x >= 0 && x < 15 && y >= 0 && y < 15;
    },

    /**
     * @param int
     * @param int
     * @return Player|null
     */
    getCoords: function (x, y) {
        return this.coords[x][y];
    },

    /**
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
     * @return void
     */
    tryMove: function (player, x, y) {
        if (this.actual != player || !this.isValidCoords(x, y) || this.getCoords(x, y) != null) return;
        this.setCoords(x, y, player);
        if (player == this.player1) this.actual = this.player2;
        else this.actual = this.player1;

        var i, j,
            directions = [];

        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y) && this.getCoords(x - i, y) == player) i++;
        while (this.isValidCoords(x + j, y) && this.getCoords(x + j, y) == player) j++;
        if (i + j == 6) {
            directions.push(1);
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x, y - i) && this.getCoords(x, y - i) == player) i++;
        while (this.isValidCoords(x, y + j) && this.getCoords(x, y + j) == player) j++;
        if (i + j == 6) {
            directions.push(2);
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y - i) && this.getCoords(x - i, y - i) == player) i++;
        while (this.isValidCoords(x + j, y + j) && this.getCoords(x + j, y + j) == player) j++;
        if (i + j == 6) {
            directions.push(3);
        }

        i = 1;
        j = 1;
        while (this.isValidCoords(x - i, y + i) && this.getCoords(x - i, y + i) == player) i++;
        while (this.isValidCoords(x + j, y - j) && this.getCoords(x + j, y - j) == player) j++;
        if (i + j == 6) {
            directions.push(4);
        }

        if (directions.length) {
            this.victory(x, y, directions);
        }

        var full = true;
        for (i = 0; i < 15; i++) {
            for (j = 0; j < 15; j ++) {
                if (this.getCoords(i, j) == null) full = false;
            }
        }
        if (full) {
            this.draw();
            return;
        }
        
        this.run();
    },

    /**
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
     * @return void
     */
    draw: function() {
        this.end();
    },

    /**
     * @return void
     */
    end: function() {
        this.actual = null;
        $('#reset').addClass('highlight');
    },

    /**
     * @return void
     */
    run: function () {
        this.actual.move();
    },

});

/**
 * @class
 */
var Player = class({

    /**
     * @return void
     */
    constructor: function (game, image) {
        this.game = game;
        this.image = image;
    },

    /**
     * @return void
     */
    move: function () {},

});

/**
 * @class
 */
var Computer = class({

    Extends: Player,

    /**
     * @return void
     */
    constructor: function () {
        Player.apply(this, arguments);
    },

    /**
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

    /**
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
            self, opponent, valid, tx, ty;
        for (var i = 1; i <= 5; i++) {
            self = 0;
            opponent = 0;
            valid = true;
            for (var j = 1; j <= 5; j++) {
                tx = x + (i + j - 6) * dx;
                ty = y + (i + j - 6) * dy;
                if (!this.game.isValidCoords(tx, ty))
                    valid = false;
                else if (this.game.getCoords(tx, ty) == this)
                    self++;
                else if (this.game.getCoords(tx, ty) != null)
                    opponent++;
            }
            if (!valid) continue;
            if (opponent > 0 && self == 0)
                score += this.scoreDefense(opponent);
            else if (self > 0 && opponent == 0)
                score += this.scoreAttack(self);
            else
                score++;
        }
        return score;
    },

    /**
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
     * @return void
     */
    move: function () {
        var now, fields = [],
            top = 0;
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
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
        now = fields[Math.floor(Math.random() * fields.length)];
        this.game.tryMove(this, now[0], now[1]);
    },

});

/**
 * @class
 */
var Human = class({

    Extends: Player,

    /**
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


$('#play').click(function () {

    var type = $('input:radio[name=type]:checked').val();
    var image = $('input:radio[name=image]:checked').val() == 0;

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
    game.actual = player1;

    $('#reset').removeClass('highlight');
    $('#new').css('display', 'none');
    $('#game').css('display', 'block');
    $('#game .victorious').removeClass('victorious');

    game.run();

});
