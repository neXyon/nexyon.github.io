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

        this.player = new VeggieWar.Player(this, new VeggieWar.GamePadController());
        this.player2 = new VeggieWar.Player(this, new VeggieWar.KeyboardMouseController());
    },

    update: function() {
        this.player.update();
        this.player2.update();
    }
};
