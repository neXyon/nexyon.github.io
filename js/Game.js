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
        this.on_rope = false;
        this.rope_energy = 0;

        this.rope_distance = 0;

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

        if(!this.on_rope) {
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

        if(this.on_rope) {
            if(this.hand_goal.hand == this.left_hand) {
                doleft = false;
            }
            else {
                doright = false;
            }

            var player_accel = 0;

            if(this.cursors.left.isDown) {
                player_accel = -100;
            }
            else if(this.cursors.right.isDown) {
                player_accel = 100;
            }

            if(this.cursors.up.isDown) {
                if(this.rope_distance > 12) {
                    this.rope_distance -= this.game.time.physicsElapsed * 100;
                    this.rope_energy -= this.game.time.physicsElapsed * 100 * 400;
                }
            }
            else if(this.cursors.down.isDown) {
                if(this.rope_distance < 200) {
                    this.rope_distance += this.game.time.physicsElapsed * 100;
                    this.rope_energy += this.game.time.physicsElapsed * 100 * 400;
                }
            }

            var d = Phaser.Point.subtract(this.player.position, this.hand_goal.hand.position);
            var dlength = d.getMagnitude();
            Phaser.Point.multiplyAdd(this.hand_goal.hand.position, d, this.rope_distance / dlength, this.player.position);

            if(d.x > 0) {
                d.perp();
            }
            else {
                d.rperp();
            }

            d.multiply(1 / dlength, 1 / dlength);
            dlength = d.y * 400;
            this.player.body.acceleration.setTo(dlength * d.x + player_accel, dlength * d.y);

            dlength = this.player.body.velocity.getMagnitude() * 0.999;

            //var h = this.hand_goal.hand.position.y + this.rope_distance - this.player.position.y;
            //dlength = Math.sqrt((this.rope_energy - 400 * h) * 2);

            if(this.player.body.velocity.dot(d) < 0) {
                d.multiply(-1, -1);
            }

            this.player.body.velocity.setTo(d.x * dlength, d.y * dlength);

            /*var amp = 400 * d.y / (dlength * dlength);

            d.setTo(-amp * d.x, 400 - amp * d.y);

            this.player.body.acceleration.setTo(d.x, d.y);

            d.normalize();
            dlength = this.player.body.velocity.getMagnitude();
            this.player.body.velocity.set(d.x * dlength, d.y * dlength);*/
        }
        else {
            if(this.hand_goal != null) {
                this.game.physics.arcade.moveToXY(this.hand_goal.hand, this.hand_goal.x, this.hand_goal.y, speed);
                var dx = this.hand_goal.x - this.hand_goal.hand.position.x;
                var dy = this.hand_goal.y - this.hand_goal.hand.position.y;
                if(dx * dx + dy * dy < 100) {
                    this.hand_goal = null;
                }
                else {
                    this.hand_goal.hand.blocked = false;
                    this.game.physics.arcade.overlap(this.hand_goal.hand, this.platformLayer);

                    var touching = this.hand_goal.hand.body.blocked;
                    touching = touching.left || touching.right || touching.up || touching.down;

                    if(touching) {
                        this.on_rope = true;
                        this.player.body.velocity.setTo(0, 0);
                        this.player.body.gravity.y = 0;

                        this.rope_distance = Phaser.Point.distance(this.hand_goal.hand.position, this.player.position);
                        this.rope_energy = 400 * (this.hand_goal.hand.position.y + this.rope_distance - this.player.position.y);

                        this.hand_goal.hand.body.velocity.set(0, 0);
                    }
                    if(this.hand_goal.hand == this.left_hand) {
                        doleft = false;
                    }
                    else {
                        doright = false;
                    }
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
