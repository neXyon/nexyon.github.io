var VeggieWar = VeggieWar || {};

VeggieWar.Game = function () {
};

VeggieWar.Game.prototype = {
    mouseDown: function() {
        this.hand_goal = {x: this.game.input.x + this.game.camera.x, y: this.game.input.y + this.game.camera.y, hand: this.left_hand};

        if(this.player.position.x > this.hand_goal.x) {
            this.hand_goal.hand = this.right_hand;
        }

    },

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
        this.player.anchor.setTo(0.5, 0.5);

        this.left_hand = this.game.add.sprite(1024 + 16, 600 + 2, 'hand');
        this.left_hand.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.left_hand);
        this.left_hand.body.allowRotation = false;
        this.right_hand = this.game.add.sprite(1024 - 16, 600 + 2, 'hand');
        this.right_hand.scale.x = -1;
        this.right_hand.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.right_hand);
        this.right_hand.body.allowRotation = false;

        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 400;

        this.hand_goal = null;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.onDown.add(this.mouseDown, this);


        this.game.physics.arcade.TILE_BIAS = 32;

        this.move = {x: 0};
        this.movetween = null;
    },

    update: function() {

        if(this.player.position.x < VeggieWar.PLAYER_MAX_WIDTH / 2) {
            this.player.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            this.left_hand.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            this.right_hand.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.x > VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH * 1.5) {
            this.player.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            this.left_hand.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            this.right_hand.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.y < VeggieWar.PLAYER_MAX_WIDTH / 2) {
            this.player.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            this.left_hand.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            this.right_hand.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
        }

        if(this.player.position.y > VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT * 1.5) {
            this.player.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            this.left_hand.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            this.right_hand.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
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

        if(this.player.body.velocity.x < 0) {
            this.player.scale.x = 1;
            this.player.bringToTop();
            this.left_hand.bringToTop();
        } else if(this.player.body.velocity.x > 0) {
            this.player.scale.x = -1;
            this.player.bringToTop();
            this.right_hand.bringToTop();
        }

        var speed = 1000;
        var maxtime = 40;

        var doleft = true;
        var doright = true;

        if(this.hand_goal != null) {
            this.game.physics.arcade.moveToXY(this.hand_goal.hand, this.hand_goal.x, this.hand_goal.y, speed);
            var dx = this.hand_goal.x - this.hand_goal.hand.position.x;
            var dy = this.hand_goal.y - this.hand_goal.hand.position.y;
            if(dx * dx + dy * dy < 100) {
                this.hand_goal = null;
            }
            else {
                if(this.hand_goal.hand == this.left_hand) {
                    doleft = false;
                }
                else {
                    doright = false;
                }
            }
        }
        if(doleft) {
            this.game.physics.arcade.moveToXY(this.left_hand, this.player.position.x + 16, this.player.position.y + 4, speed, maxtime);
        }
        if(doright) {
            this.game.physics.arcade.moveToXY(this.right_hand, this.player.position.x - 16, this.player.position.y + 4, speed, maxtime);
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
