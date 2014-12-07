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

        this.player = this.game.add.sprite(1024, 600, 'player');
        //this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 200;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        //this.player.body.collideWorldBounds = true;

        this.game.physics.arcade.TILE_BIAS = 32;
    },

    update: function() {

        if(this.player.position.x < 0) {
            this.player.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.x > VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH) {
            this.player.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.y < 0) {
            this.player.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
        }

        if(this.player.position.y > VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT) {
            this.player.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
        }

        this.game.physics.arcade.collide(this.player, this.platformLayer);

        if(this.player.body.onFloor()) {
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x = -100;
            }
            else if(this.cursors.right.isDown) {
                this.player.body.velocity.x = 100;
            }
            else {
                this.player.body.velocity.x = 0;
            }

            if(this.cursors.up.isDown) {
                this.player.body.velocity.y = -200;
            }
        }
    }
}
