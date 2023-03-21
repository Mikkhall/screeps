// import modules
require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleClaimer = require('role.claimer');
var roleMinerL = require('role.miner');
var roleMinerS = require('role.miner');
var roleLorry = require('role.lorry');
var roleMineralHarvester = require('role.mineralHarvester');

// 63ffec2f5798f56f946693e0
// Game.market.deal('63fae2cdf66f5bf80532a0fd');
// Game.market.getOrderById('63ffec2f5798f56f946693e0');

module.exports.loop = function () {
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target)
        }
    }
    /*
    if (target == undefined) {
        var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
        for (let tower of towers) {
            if (tower.energy > 200) {
                var target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                });
                if (target) {
                    tower.repair(target);
                }
            }
        }
    }
    */
    
    
    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role  == 'mineralHarvester') {
            roleMineralHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        // if creep is claimer, call claimer script
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        // if creep is miner, call miner script
        else if (creep.memory.role == 'minerL') {
            roleMinerL.run(creep);
        }
        else if (creep.memory.role == 'minerS') {
            roleMinerS.run(creep);
        }
        else if (creep.memory.role == 'lorry') {
            roleLorry.run(creep);
        }
    }

    // iterate over all the spawns
    for (let spawnName in Game.spawns) {
        /** @type {Spawn} */
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        /** @type {Room} */
        let room = spawn.room;

        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        var numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        var numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        var numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        var numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
        var numberOfMinersL = _.sum(creepsInRoom, (c) => c.memory.role == 'minerL');
        var numberOfMinersS = _.sum(creepsInRoom, (c) => c.memory.role == 'minerS');
        var numberOfLorries = _.sum(creepsInRoom, (c) => c.memory.role == 'lorry');
        var numberOfMineralHarvester = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralHarvester');

        var energy = spawn.room.energyCapacityAvailable;
        var name = undefined;

        // if none of the above caused a spawn command check for other roles
        var target = spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (name == undefined && target == undefined) {
            if (numberOfHarvesters == 0) {
                name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
            }
            // if not enough harvesters
            if (numberOfHarvesters < spawn.memory.minHarvesters) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'harvester'); 
            }
            else if (numberOfLorries < spawn.memory.minLorries) {
                // try to spawn one
                name = spawn.createLorry(energy);
            }
            else if (numberOfMinersS < spawn.memory.minMinersS && energy >= 550) {
                // try to spawn one
                name = spawn.createMiner("5bbcac119099fc012e634d63", "minerS");
            }
            else if (numberOfMinersL < spawn.memory.minMinersL && energy >= 550) {
                // try to spawn one
                name = spawn.createMiner("5bbcac119099fc012e634d64", "minerL");
            }
            // if there is a claim order defined
            else if (spawn.memory.claimRoom != undefined) {
                // try to spawn a claimer
                name = spawn.createClaimer(spawn.memory.claimRoom);
                // if that worked
                if (!(name < 0)) {
                    // delete the claim order
                    delete spawn.memory.claimRoom;
                }
            }
            // if not enough upgraders
            else if (numberOfUpgraders < spawn.memory.minUpgraders) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'upgrader');
            }
            // if not enough repairers
            else if (numberOfRepairers < spawn.memory.minRepairers) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'repairer');
            }
            // if not enough builders
            else if (numberOfBuilders < spawn.memory.minBuilders) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'builder');
            }
            /**
            else if (numberOfMineralHarvester < spawn.memory.minMineralHarvesters) {
                var minerals = spawn.room.find(FIND_MINERALS);
                var mineral = minerals[0];
                if (mineral.mineralAmount != 0) {
                    name = spawn.createMineralHarvester(energy, 'mineralHarvester');
                }
            }
            **/
        }
        /*
        // Terminal trade execution
        tradeResource = 0;
        if (spawn.room.terminal.store[RESOURCE_OXYGEN]) {
            tradeResource = RESOURCE_OXYGEN;
            sellAmount = spawn.room.terminal.store[tradeResource];
            minPrice = 0.07;
        }
        else if (spawn.room.terminal.store[RESOURCE_ZYNTHIUM]) {
            tradeResource = RESOURCE_ZYNTHIUM;
            sellAmount = spawn.room.terminal.store[tradeResource];
            minPrice = 0.03;
        }
        // Terminal trade execution
        if (spawn.room.terminal && tradeResource != 0) {
            if (spawn.room.terminal.store[RESOURCE_ENERGY] >= 200 && spawn.room.terminal.store[tradeResource] >= 100) {
                var orders = Game.market.getAllOrders(order => order.resourceType == tradeResource &&
                                                      order.type == ORDER_BUY &&
                                                      order.remainingAmount >= 100);
                //console.log(tradeResource, ' buy orders found: ' + orders.length);
                orders = _.sortBy(orders, "price");
                orders.reverse();
                if (sellAmount > orders[0].amount) {
                    sellAmount = orders[0].amount;
                }
                if (spawn.room.terminal.store[RESOURCE_ENERGY] / 4 < sellAmount) {
                    sellAmount = spawn.room.terminal.store[RESOURCE_ENERGY] / 4;
                }
                //console.log('Best price: ' + orders[0].price);
                if (orders[0].price > minPrice) {
                    var result = Game.market.deal(orders[0].id, sellAmount, spawn.room.name);
                    if (result == 0) {
                        console.log('Order completed successfully');
                    }
                }
            }
        }
        */
    }
};