var VeggieWar = VeggieWar || {};

VeggieWar.Boot = function () {
};

VeggieWar.Boot.prototype = {
    create: function () {
        this.game.stage.backgroundColor = '#000';

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.state.start('Preload');
    }
};