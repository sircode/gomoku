/**
 * @class
 */
var Game = class({

    /**
     * @param bool
     * @return void
     */
    constructor: function (hardcore) {
        this.hardcore = hardcore;
    },

    /**
     * @return bool
     */
    isHardcore: function () {
        return this.hardcore;
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
     * @return Player|null
     */
    getCoords: function (x, y) {
        var field = this.getField(x, y);
        if ((field.hasClass('cross') && this.player1.image) || (field.hasClass('circle') && !this.player1.image)) {
            return this.player1;
        } else if ((field.hasClass('cross') && this.player2.image) || (field.hasClass('circle') && !this.player2.image)) {
            return this.player2;
        } else {
            return null;
        }
    },

    /**
     * @param int
     * @param int
     * @param Player
     */
    setCoords: function (x, y, player) {
        var field = this.getField(x, y);
        if (player.image) {
            field.addClass('cross');
        } else {
            field.addClass('circle');
        }
    },

    /**
     * @return void
     */
    tryMove: function (player, x, y) {
        if (this.actual != player || x < 0 || x >= 15 || y < 0 || y >= 15 || this.getCoords(x, y) != null) return;
        this.setCoords(x, y, player);
        if (player == this.player1) this.actual = this.player2;
        else this.actual = this.player1;

        var i, j;

        i = 1;
        j = 1;
        while (x - i >= 0 && this.getCoords(x - i, y) == player) i++;
        while (x + j < 15 && this.getCoords(x + j, y) == player) j++;
        if (i + j == 6) {
            this.victory(x, y, 1);
            return;
        }

        i = 1;
        j = 1;
        while (y - i >= 0 && this.getCoords(x, y - i) == player) i++;
        while (y + j < 15 && this.getCoords(x, y + j) == player) j++;
        if (i + j == 6) {
            this.victory(x, y, 2);
            return;
        }

        i = 1;
        j = 1;
        while (x - i >= 0 && y - i >= 0 && this.getCoords(x - i, y - i) == player) i++;
        while (x + j < 15 && y + j < 15 && this.getCoords(x + j, y + j) == player) j++;
        if (i + j == 6) {
            this.victory(x, y, 3);
            return;
        }

        i = 1;
        j = 1;
        while (x - i >= 0 && y + i < 15 && this.getCoords(x - i, y + i) == player) i++;
        while (x + j < 15 && y - j >= 0 && this.getCoords(x + j, y - j) == player) j++;
        if (i + j == 6) {
            this.victory(x, y, 4);
            return;
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
     * @param int
     * @return void
     */
    victory: function(x, y, direction) {
        var i = 1,
            j = 1;
            player = this.getCoords(x, y);
        switch (direction) {
            case 1: // -
                while (x - i >= 0 && this.getCoords(x - i, y) == player) this.getField(x - i++, y).addClass('victorious');
                while (x + j < 15 && this.getCoords(x + j, y) == player) this.getField(x + j++, y).addClass('victorious');
                break;
            case 2: // |
                while (y - i >= 0 && this.getCoords(x, y - i) == player) this.getField(x, y - i++).addClass('victorious');
                while (y + j < 15 && this.getCoords(x, y + j) == player) this.getField(x, y + j++).addClass('victorious');
                break;
            case 3: // \
                while (x - i >= 0 && y - i >= 0 && this.getCoords(x - i, y - i) == player) this.getField(x - i, y - i++).addClass('victorious');
                while (x + j < 15 && y + j < 15 && this.getCoords(x + j, y + j) == player) this.getField(x + j, y + j++).addClass('victorious');
                break;
            case 4: // /
                while (x - i >= 0 && y + i < 15 && this.getCoords(x - i, y + i) == player) this.getField(x - i, y + i++).addClass('victorious');
                while (x + j < 15 && y - j >= 0 && this.getCoords(x + j, y - j) == player) this.getField(x + j, y - j++).addClass('victorious');
                break;
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
     * @return void
     */
    move: function () {

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
                x = $(this).prevAll().size();
                y = $(this).parent().prevAll().size();
                player.game.tryMove(player, x, y);
            });
        })(this);
    },

});


$('#play').click(function () {

    var type = $('input:radio[name=type]:checked').val();
    var image = $('input:radio[name=image]:checked').val() == 1;
    var hardcore = $('input:radio[name=hardcore]:checked').val() == 1;

    var game = new Game(hardcore);
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
