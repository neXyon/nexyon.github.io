var VeggieWar = VeggieWar || {};

VeggieWar.Game = function () {
};

VeggieWar.Game.prototype = {
    create: function () {
        this.map = this.game.add.tilemap('map');

        this.map.addTilesetImage('grass', 'grass');

        this.platformLayer = this.map.createLayer('platforms');
        this.backgroundLayer = this.map.createLayer('background');

        this.map.setCollisionBetween(1, 100, true, this.platformLayer);
        this.backgroundLayer.resizeWorld();

        this.game.camera.setPosition(VeggieWar.PLAYER_MAX_WIDTH, VeggieWar.PLAYER_MAX_HEIGHT);
        this.game.camera.update();

        this.game.physics.arcade.TILE_BIAS = 32;

        this.game.input.gamepad.start();

        this.players = [];

        this.controllers = [];

        this.controllers.push(new VeggieWar.KeyboardMouseController());
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad1, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad2, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad3, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad4, this.game));
    },

    update: function() {

        for(var i = 0; i < this.controllers.length; i++) {
            if(this.controllers[i].isReady()) {
                this.players.push(new VeggieWar.Player(this, this.controllers[i]));
                this.controllers.splice(i, 1);
                i--;
            }
        }

        for(var i = 0; i < this.players.length; i++) {
            this.players[i].update(players);
        }
    }
};
