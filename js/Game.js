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

        this.game.camera.setPosition(128, 128);
        this.game.camera.update();

        this.player = this.game.add.sprite(1024, 600, 'player');
        this.game.physics.arcade.enable(this.player);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        if(this.cursors.up.isDown) {
            this.player.body.velocity.y -= 500;
        }
        else if(this.cursors.down.isDown) {
            this.player.body.velocity.y += 500;
        }
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x -= 500;
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x += 500;
        }

        this.game.physics.arcade.collide(this.player, this.platformLayer);
    }
}
