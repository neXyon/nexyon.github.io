var SCREEN_WIDTH = 1920;
var SCREEN_HEIGHT = 1080;


var VeggieWar = VeggieWar || {};

VeggieWar.game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, '');

VeggieWar.game.state.add('Boot', VeggieWar.Boot);
VeggieWar.game.state.add('Preload', VeggieWar.Preload);
VeggieWar.game.state.add('Game', VeggieWar.Game);

VeggieWar.game.state.start('Boot');
