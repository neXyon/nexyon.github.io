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
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 400;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.physics.arcade.TILE_BIAS = 32;

        this.move = {x: 0};
        this.movetween = null;
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

        var stoptween = true;

        if(this.player.body.onFloor()) {
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x = -100;
                stoptween = false;
            }
            else if(this.cursors.right.isDown) {
                this.player.body.velocity.x = 100;
                stoptween = false;
            }
            else {
                this.player.body.velocity.x = 0;
            }

            if(this.cursors.up.isDown) {
                stoptween = true;
                this.player.body.velocity.y = -300;
                this.player.body.velocity.x *= 1.4;
            }
        }
        else {
            if(this.cursors.left.isDown) {
                this.player.body.velocity.x -= this.game.time.physicsElapsed * 100;
            }
            else if(this.cursors.right.isDown) {
                this.player.body.velocity.x += this.game.time.physicsElapsed * 100;
            }
        }

        if(stoptween) {
            if(this.movetween != null) {
                if(this.movetween.isRunning) {
                    this.movetween.repeatAll(0);
                }
                else {
                    this.movetween = null;
                }
            }
        }
        else {
            if(this.movetween == null) {
                this.movetween = this.game.add.tween(this.move).to({x: 5}, 100, Phaser.Easing.Quadratic.Out).to({x: 0}, 100, Phaser.Easing.Quadratic.In).repeatAll(-1).start();
            }
            else {
                this.movetween.repeatAll(-1);
            }
        }

        this.player.position.y += this.player.body.offset.y;
        this.player.body.offset.y = this.move.x;
        this.player.position.y -= this.move.x;
    }
}
