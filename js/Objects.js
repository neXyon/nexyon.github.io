var VeggieWar = VeggieWar || {};

VeggieWar.Bamboo = function (game, location) {
    this.game = game.game;
    this.veggie = game;
    this.location = location;

    this.GROW_SPEED = 2000;

    this.bamboo = null;
};

VeggieWar.Bamboo.prototype = {
    isOccupied: function() {
        return this.bamboo != null;
    },

    spawn: function() {
        this.bamboo = this.game.add.sprite(this.location.x, this.location.y, 'bamboo', 0, this.veggie.bamboos);
        this.bamboo.anchor.setTo(0.5, 1.0);
        this.bamboo.scale.setTo(0.5, 0.01);
        this.bamboo.me = this;
        this.game.physics.arcade.enable(this.bamboo);
        this.game.sound.play('s_grow');
        this.bamboo.body.allowRotation = true;

        this.game.add.tween(this.bamboo.scale).to({x: 1, y: 1}, this.GROW_SPEED, Phaser.Easing.Quadratic.InOut).start();
    },

    destroy: function() {
        if(this.bamboo == null) {
            return false;
        }

        this.bamboo.anchor.setTo(0.5, 0.5);
        this.bamboo.position.y -= this.bamboo.height / 2;
        this.game.add.tween(this.bamboo.body).to({angularVelocity: 1000}, this.GROW_SPEED, Phaser.Easing.Quadratic.InOut).start().onComplete.add(function() {
            this.kill();
        }, this.bamboo);
        this.bamboo = null;

        return true;
    }
}
