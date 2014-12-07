var VeggieWar = VeggieWar || {};

VeggieWar.TILE_SIZE = 32;
VeggieWar.TILE_WIDTH = 60;
VeggieWar.TILE_HEIGHT = 32;

VeggieWar.SCREEN_WIDTH = VeggieWar.TILE_SIZE * VeggieWar.TILE_WIDTH;
VeggieWar.SCREEN_HEIGHT = VeggieWar.TILE_SIZE * VeggieWar.TILE_HEIGHT;
VeggieWar.PLAYER_MAX_WIDTH = 1 * VeggieWar.TILE_SIZE;
VeggieWar.PLAYER_MAX_HEIGHT = 2 * VeggieWar.TILE_SIZE;

VeggieWar.game = new Phaser.Game(VeggieWar.SCREEN_WIDTH, VeggieWar.SCREEN_HEIGHT, Phaser.AUTO, '');

VeggieWar.game.state.add('Boot', VeggieWar.Boot);
VeggieWar.game.state.add('Preload', VeggieWar.Preload);
VeggieWar.game.state.add('Game', VeggieWar.Game);

VeggieWar.game.state.start('Boot');
