var SCREEN_WIDTH = 1920;
var SCREEN_HEIGHT = 1080;

var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update });
var scalemanager = new Phaser.ScaleManager(game, SCREEN_WIDTH, SCREEN_HEIGHT);

function preload() {
}

function create() {
    scalemanager.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    scalemanager.pageAlignHorizontally = true;
    scalemanager.pageAlignVertically = true;
    scalemanager.refresh();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.startSystem(Phaser.Physics.P2JS);
}

function update() {
}

