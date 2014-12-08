var VeggieWar = VeggieWar || {};

VeggieWar.Preload = function () {
};

VeggieWar.Preload.prototype = {
    preload: function () {
        style = {font: "100px sans", fill: "#fff", align: "center"};
        this.preloadText = this.add.text(this.game.world.centerX, this.game.world.centerY, 'Loading...', style);
        this.preloadText.anchor.setTo(0.5);

        //this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        //this.load.setPreloadSprite(this.preloadBar);

        this.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('grass', 'assets/grass.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('hand', 'assets/hand.png');
        this.load.image('bamboo', 'assets/bamboo.png');

        this.load.audio('s_bamboo', 'assets/bamboo.ogg', true);
        this.load.audio('s_grab', 'assets/grab.ogg', true);
        this.load.audio('s_grow', 'assets/grow.ogg', true);
        this.load.audio('s_hit', 'assets/hit.ogg', true);
        this.load.audio('s_jump', 'assets/jump.ogg', true);
        this.load.audio('s_shoot', 'assets/shoot.ogg', true);
    },
    create: function () {
        this.state.start('Game');
    }
};