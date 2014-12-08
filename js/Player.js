var VeggieWar = VeggieWar || {};

VeggieWar.Hand = function (player, left) {
    this.HAND_Y = 4;
    this.HAND_MOVE_SPEED = 1000;
    this.HAND_MOVE_TIME = 40;
    this.HAND_FLY_TIME = 200;

    this.GRAB_TIME = 500;

    this.STATE_FOLLOW = 0;
    this.STATE_FLY = 1;
    this.STATE_GRAB = 2;

    this.BAMBOO_SCORE = 100;
    this.PLAYER_SCORE = 250;

    this.player = player.player;
    this.game = player.game;
    this.mango = player;
    this.veggie = player.veggie;
    this.left = left;

    this.create();
};

VeggieWar.Hand.prototype = {
    setState: function(state) {
        this.state = state;
        this.elapsed = 0;
        this.hand.body.velocity.set(0, 0);
    },

    fly: function(direction) {
        if(this.state == this.STATE_FOLLOW && this.elapsed >= this.HAND_FLY_TIME) {
            this.setState(this.STATE_FLY);
            direction.normalize();
            this.direction = direction;
            this.hand.body.velocity.setTo(direction.x * this.HAND_MOVE_SPEED, direction.y * this.HAND_MOVE_SPEED);
            return true;
        }

        return false;
    },

    create: function() {
        this.player_x = this.mango.PLAYER_WIDTH;

        if(!this.left) {
            this.player_x = -this.mango.PLAYER_WIDTH;
        }

        this.hand = this.player.game.add.sprite(this.player.position.x + this.player_x, this.player.position.y + this.HAND_Y, 'hand');//, 0, this.player.group);
        this.hand.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(this.hand);
        this.hand.body.allowRotation = false;
        this.setState(this.STATE_FOLLOW);

        if(!this.left) {
            this.hand.scale.x = -1;
        }
    },

    update: function() {
        this.elapsed += this.game.time.physicsElapsedMS;
        if(this.state == this.STATE_FOLLOW) {
            // hands follow player

            this.game.physics.arcade.moveToXY(this.hand, this.player.position.x + this.player_x, this.player.position.y + this.HAND_Y, this.HAND_MOVE_SPEED, this.HAND_MOVE_TIME);

            // warp player on the side of the screen

            if(this.player.position.x < this.mango.PLAYER_WIDTH) {
                this.hand.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            }

            if(this.player.position.x > VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH + this.mango.PLAYER_WIDTH) {
                this.hand.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
            }

            if(this.player.position.y < this.mango.PLAYER_WIDTH) {
                this.hand.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            }

            if(this.player.position.y > VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT + this.mango.PLAYER_WIDTH) {
                this.hand.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
            }
        }
        else if(this.state == this.STATE_FLY) {
            var me = this;
            this.veggie.players.forEach(function(player) {
                if(player == me.mango) {
                    return;
                }
                me.game.physics.arcade.overlap(me.hand, player.player, function(hand, pl){
                    player.push(me.direction);
                    me.mango.addScore(me.PLAYER_SCORE);
                    me.setState(me.STATE_FOLLOW);
                });
            });

            me.game.physics.arcade.overlap(me.hand, this.veggie.bamboos, function(hand, bamboo) {
                if(bamboo.me.destroy()) {
                    me.mango.addScore(me.BAMBOO_SCORE);
                    me.setState(me.STATE_FOLLOW);
                }
            });

            if(this.state == this.STATE_FOLLOW) {
                return;
            }

            this.game.physics.arcade.overlap(this.hand, this.mango.veggie.platformLayer);

            var touching = this.hand.body.blocked;
            touching = touching.left || touching.right || touching.up || touching.down;

            if(touching) {
                this.mango.push(this.direction);
                this.setState(this.STATE_GRAB);
                /*if(this.mango.setOnRope(this)) {
                    this.setState(this.STATE_GRAB);
                }
                else {
                    this.setState(this.STATE_FOLLOW);
                }*/
            }
            else if(this.elapsed >= this.HAND_FLY_TIME) {
                this.setState(this.STATE_FOLLOW);
            }
        }
        else if(this.state == this.STATE_GRAB) {
            if(this.elapsed >= this.GRAB_TIME) {
                this.setState(this.STATE_FOLLOW);
                this.mango.setOnRope(null);
            }
        }
    }
};

VeggieWar.Player = function (game, controller, location) {
    this.game = game.game;
    this.veggie = game;
    this.GRAVITY = 400;
    this.PLAYER_WIDTH = VeggieWar.PLAYER_MAX_WIDTH / 2;
    this.PLAYER_MOVE_SPEED = 100;
    this.PLAYER_AIR_ACCELERATION = 100;
    this.PLAYER_JUMP_VELOCITY = 300;
    this.PLAYER_JUMP_SPEED_FACTOR = 1.4;
    this.STATE_FREE = 0;
    this.STATE_THROWN = 1;
    this.STATE_ON_ROPE = 2;
    this.STUN_TIME = 250;
    this.THROW_POWER = 500;

    this.FLASH_TIME = 300;

    this.SCORE_MOVE_SPEED = 1000;
    this.SCORE_MOVE_TIME = 40;

    this.controller = controller;
    this.location = location;

    this.create();
};

VeggieWar.Player.prototype = {
    push: function(direction) {
        this.setState(this.STATE_THROWN);
        this.player.body.velocity.add(direction.x * this.THROW_POWER, direction.y * this.THROW_POWER);
    },

    setOnRope: function(hand) {
        if(hand != null) {
            if(this.on_rope != null)
                return false;

            this.setState(this.STATE_ON_ROPE);
            this.on_rope = hand.hand;

            this.player.body.velocity.setTo(0, 0);
            this.player.body.gravity.y = 0;

            this.rope_distance = Phaser.Point.distance(hand.hand.position, this.player.position);
        }
        else {
            this.setState(this.STATE_FREE);
            this.on_rope = null;

            this.player.body.gravity.y = this.GRAVITY;
            this.player.body.acceleration.setTo(0, 0);
        }
        return true;
    },

    fire: function(direction) {
        if(this.state != this.STATE_FREE) {
            return;
        }

        if(direction.x > 0) {
            if(!this.left_hand.fly(direction)){
                this.right_hand.fly(direction);
            }
        }
        else {
            if(!this.right_hand.fly(direction)){
                this.left_hand.fly(direction);
            }
        }
    },

    setState: function(state) {
        this.state = state;
        this.elapsed = 0;
    },

    addScore: function(amount) {
        this.score += amount;
        this.score_text.text = this.score;
        this.game.add.tween(this.score_text.scale).to({x: 3, y: 3}, this.FLASH_TIME / 3, Phaser.Easing.Quadratic.InOut).to({x: 1, y: 1}, this.FLASH_TIME, Phaser.Easing.Quadratic.InOut).start();
    },

    create: function () {
        //this.group = this.game.add.group();

        this.player = this.game.add.sprite(this.location.x, this.location.y, 'player');
        this.player.anchor.setTo(0.5, 0.5);

        this.left_hand = new VeggieWar.Hand(this, true);
        this.right_hand = new VeggieWar.Hand(this, false);

        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.GRAVITY;

        this.on_rope = null;

        this.rope_distance = 0;

        this.move = {x: 0};
        this.movetween = null;

        this.score = 0;
        var style = { font: "12px sans", fill: "#ff1727", align: "center" };
        this.score_text = this.game.add.text(0, 10, '0', style);
        this.score_text.anchor.setTo(0.5, 0.5);

        this.score_sprite = this.game.add.sprite(this.player.position.x, this.player.position.y, null);
        this.score_sprite.addChild(this.score_text);
        this.game.physics.arcade.enable(this.score_sprite);

        this.setState(this.STATE_FREE);

        this.controller.create(this);
    },

    update: function() {
        this.elapsed += this.game.time.physicsElapsedMS;
        this.controller.update();

        this.game.physics.arcade.collide(this.player, this.veggie.platformLayer);

        var stop_move_tween = true;
        this.left_hand.follow_player = true;
        this.right_hand.follow_player = true;

        if(this.state == this.STATE_FREE) {
            // ground movement
            if(this.player.body.onFloor()) {
                if(this.controller.left) {
                    this.player.body.velocity.x = -this.PLAYER_MOVE_SPEED;
                    stop_move_tween = false;
                }
                else if(this.controller.right) {
                    this.player.body.velocity.x = this.PLAYER_MOVE_SPEED;
                    stop_move_tween = false;
                }
                else {
                    this.player.body.velocity.x = 0;
                }

                if(this.controller.up) {
                    stop_move_tween = true;
                    this.player.body.velocity.y = -this.PLAYER_JUMP_VELOCITY;
                    this.player.body.velocity.x *= this.PLAYER_JUMP_SPEED_FACTOR;
                }
            }
            // air movement
            else {
                if(this.controller.left) {
                    this.player.body.velocity.x -= this.game.time.physicsElapsed * this.PLAYER_AIR_ACCELERATION;
                }
                else if(this.controller.right) {
                    this.player.body.velocity.x += this.game.time.physicsElapsed * this.PLAYER_AIR_ACCELERATION;
                }
            }
        }
        else if(this.state == this.STATE_THROWN) {
            if(this.elapsed > this.STUN_TIME) {
                this.setState(this.STATE_FREE);
            }
        }
        // on rope!
        else if(this.state == this.STATE_ON_ROPE) {
            var player_accel = 0;

            if(this.controller.left) {
                player_accel = -100;
            }
            else if(this.controller.right) {
                player_accel = 100;
            }

            if(this.controller.up) {
                if(this.rope_distance > 12) {
                    this.rope_distance -= this.game.time.physicsElapsed * 100;
                }
            }
            else if(this.controller.down) {
                if(this.rope_distance < 200) {
                    this.rope_distance += this.game.time.physicsElapsed * 100;
                }
            }

            var d = Phaser.Point.subtract(this.player.position, this.on_rope.position);
            var dlength = d.getMagnitude();
            Phaser.Point.multiplyAdd(this.on_rope.position, d, this.rope_distance / dlength, this.player.position);

            if(d.x > 0) {
                d.perp();
            }
            else {
                d.rperp();
            }

            d.multiply(1 / dlength, 1 / dlength);
            dlength = d.y * this.GRAVITY;
            this.player.body.acceleration.setTo(dlength * d.x + player_accel, dlength * d.y);

            dlength = this.player.body.velocity.getMagnitude() * 0.999;

            if(this.player.body.velocity.dot(d) < 0) {
                d.multiply(-1, -1);
            }

            this.player.body.velocity.setTo(d.x * dlength, d.y * dlength);//*/
        }

        this.left_hand.update();
        this.right_hand.update();

        // warp player on the side of the screen

        if(this.player.position.x < this.PLAYER_WIDTH) {
            this.player.position.x += VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.x > VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH + this.PLAYER_WIDTH) {
            this.player.position.x -= VeggieWar.SCREEN_WIDTH + VeggieWar.PLAYER_MAX_WIDTH;
        }

        if(this.player.position.y < this.PLAYER_WIDTH) {
            this.player.position.y += VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
        }

        if(this.player.position.y > VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT + this.PLAYER_WIDTH) {
            this.player.position.y -= VeggieWar.SCREEN_HEIGHT + VeggieWar.PLAYER_MAX_HEIGHT;
        }

        // player rendering correction

        if(this.player.body.velocity.x < 0) {
            this.player.scale.x = 1;
            this.player.bringToTop();
            this.left_hand.hand.bringToTop();
        } else if(this.player.body.velocity.x > 0) {
            this.player.scale.x = -1;
            this.player.bringToTop();
            this.right_hand.hand.bringToTop();
        }
        this.score_sprite.bringToTop();

        // jumping of player while on ground and moving

        if(stop_move_tween) {
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

        this.game.physics.arcade.moveToXY(this.score_sprite, this.player.position.x, this.player.position.y, this.SCORE_MOVE_SPEED, this.SCORE_MOVE_TIME);
    }
};

