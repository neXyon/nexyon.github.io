var VeggieWar = VeggieWar || {};

VeggieWar.GamePadController = function(pad, game) {
    this.pad = pad;
    this.game = game;
};

VeggieWar.GamePadController.prototype = {
    isReady: function() {
        return this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected;
    },

    create: function(player) {
        this.player = player;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.isdown = false;
    },

    update: function() {
        var isdown = this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER) || this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER || this.pad.isDown(Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON));
        if(isdown != this.isdown) {
            this.isdown = isdown;
            if(isdown) {
                var direction = new Phaser.Point(this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X), this.pad.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y))
                this.player.fire(direction);
            }
        }

        this.left = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;
        this.right = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;
        this.up = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;
        this.down = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;
    }
};

VeggieWar.KeyboardMouseController = function() {
};

VeggieWar.KeyboardMouseController.prototype = {
    isReady: function() {
        return true;
    },

    mouseDown: function() {
        var direction = new Phaser.Point(this.player.game.input.x + this.player.game.camera.x - this.player.player.position.x,
            this.player.game.input.y + this.player.game.camera.y - this.player.player.position.y);

        this.player.fire(direction);
    },

    create: function(player) {
        this.player = player;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;

        this.player.game.input.onDown.add(this.mouseDown, this);
        this.cursors = this.player.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.left = this.cursors.left.isDown;
        this.right = this.cursors.right.isDown;
        this.up = this.cursors.up.isDown;
        this.down = this.cursors.down.isDown;
    }
};

