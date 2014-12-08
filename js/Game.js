var VeggieWar = VeggieWar || {};

VeggieWar.Game = function () {
    this.BAMBOO_LIKELYHOOD = 10.0;
};

VeggieWar.Game.prototype = {
    create: function () {
        this.bamboo_spawns = [];
        this.player_spawns = [];

        this.map = this.game.add.tilemap('map');

        this.map.addTilesetImage('grass', 'grass');

        this.platformLayer = this.map.createLayer('platforms');
        this.backgroundLayer = this.map.createLayer('background');

        this.map.setCollisionBetween(1, 100, true, this.platformLayer);
        this.backgroundLayer.resizeWorld();

        var me = this;

        this.map.objects['bamboo'].forEach(function(bamboo){
            me.bamboo_spawns.push(new VeggieWar.Bamboo(me, {x: bamboo.x, y: bamboo.y}));
        });

        this.map.objects['player'].forEach(function(player){
            me.player_spawns.push({x: player.x, y: player.y});
        });

        this.bamboos = this.game.add.group();

        this.game.camera.setPosition(VeggieWar.PLAYER_MAX_WIDTH, VeggieWar.PLAYER_MAX_HEIGHT);
        this.game.camera.update();

        this.game.physics.arcade.TILE_BIAS = 32;

        this.game.input.gamepad.start();

        this.elapsed = 0;

        this.players = [];

        this.controllers = [];

        this.controllers.push(new VeggieWar.KeyboardMouseController());
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad1, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad2, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad3, this.game));
        this.controllers.push(new VeggieWar.GamePadController(this.game.input.gamepad.pad4, this.game));
    },

    update: function() {
        this.elapsed += this.game.time.physicsElapsed;

        var free_spawns = 0;
        var likelyhood = this.BAMBOO_LIKELYHOOD * this.game.time.physicsElapsed;

        this.bamboo_spawns.forEach(function(spawn) {
            if(!spawn.isOccupied()) {
                free_spawns++;
            }
            else {
                likelyhood *= 0.75;
            }
        });

            if((free_spawns > 0) && (this.game.rnd.frac() < likelyhood)) {
            free_spawns = this.game.rnd.integerInRange(1, free_spawns);

            for(var i = 0; i < this.bamboo_spawns.length; i++) {
                if(!this.bamboo_spawns[i].isOccupied()) {
                    free_spawns--;

                    if(free_spawns == 0) {
                        this.bamboo_spawns[i].spawn();

                        break;
                    }
                }
            }
        }

        for(var i = 0; i < this.controllers.length; i++) {
            if(this.controllers[i].isReady()) {
                this.players.push(new VeggieWar.Player(this, this.controllers[i], this.player_spawns.pop()));
                this.controllers.splice(i, 1);
                i--;
            }
        }

        for(var i = 0; i < this.players.length; i++) {
            this.players[i].update(this.players);
        }
    }
};
