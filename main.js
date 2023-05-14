// import modules
require('prototype.spawn')();
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');
let roleClaimer = require('role.claimer');
let roleDismantler = require('role.dismantler');
let roleMiner = require('role.miner');
let roleLorry = require('role.lorry');
let roleMineralHarvester = require('role.mineralHarvester');
let roleLongDistanceHarvester = require('role.longDistanceHarvester');
let roleAttacker = require('role.attacker');

// Game.creeps.creep.drop(RESOURCE_ENERGY)

// Game.market.deal('63ffec2f5798f56f946693e0');
/*
Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: ACCESS_KEY,
    price: 675000000,
    totalAmount: 1,
    roomName: "W15S37"
});
if(Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
}
 */

module.exports.loop = function () {
    //console.log(Game.cpu.bucket);
    
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target)
        }
        if (target == undefined) {
            let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
            for (let tower of towers) {
                if (tower.energy > 200) {
                    let target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax / 10 && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
                    });
                    if (target) {
                        tower.repair(target);
                    }
                }
            }
        }
    }
    
    // for every creep name in Game.creeps
    for (let name in Game.creeps) {
        // get the creep object
        let creep = Game.creeps[name];

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
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'lorry') {
            roleLorry.run(creep);
        }
        else if (creep.memory.role == 'dismantler') {
            roleDismantler.run(creep);
        }
        else if (creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
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
        let numberOfHarvesters = _.sum(creepsInRoom, (c) => c.memory.role == 'harvester');
        let numberOfUpgraders = _.sum(creepsInRoom, (c) => c.memory.role == 'upgrader');
        let numberOfBuilders = _.sum(creepsInRoom, (c) => c.memory.role == 'builder');
        let numberOfRepairers = _.sum(creepsInRoom, (c) => c.memory.role == 'repairer');
        let numberOfLorries = _.sum(creepsInRoom, (c) => c.memory.role == 'lorry');
        let numberOfMineralHarvester = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralHarvester');
        let numberOfDismantlers = _.sum(creepsInRoom, (c) => c.memory.role == 'dismantler');

        let energy = spawn.room.energyCapacityAvailable;

        // if none of the above caused a spawn command check for other roles
        let target = spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target == undefined) {
            // check if all sources have miners
            let sources = room.find(FIND_SOURCES);
            // iterate over all sources
            for (let source of sources) {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    // check whether the source has a container
                    /** @type {Array.StructureContainer} */
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        // spawn a miner
                        name = spawn.createMiner(source.id, energy);
                        break;
                    }
                }
            }

            if (numberOfHarvesters == 0 && numberOfLorries == 0) {
                name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
            }
            // if not enough harvesters
            else if (numberOfHarvesters < spawn.memory.minHarvesters) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'harvester');
            }
            else if (numberOfLorries < spawn.memory.minLorries) {
                // try to spawn one
                name = spawn.createLorry(energy);
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
            // if not enough upgraders
            // Math.floor(spawn.memory.minUpgraders * spawn.room.storage.store[RESOURCE_ENERGY] / 200000)
            else if (numberOfUpgraders < spawn.memory.minUpgraders) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'upgrader');
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
            else if (numberOfMineralHarvester < spawn.memory.minMineralHarvesters && spawn.room.terminal.store.getUsedCapacity() - spawn.room.terminal.store[RESOURCE_ENERGY] < 100000) {
                let minerals = spawn.room.find(FIND_MINERALS);
                let mineral = minerals[0];
                if (mineral.mineralAmount > 2000) {
                    name = spawn.createMineralHarvester(energy, 'mineralHarvester');
                }
                else if (mineral.mineralAmount != 0 && numberOfMineralHarvester < 1) {
                    name = spawn.createMineralHarvester(energy, 'mineralHarvester');
                }
            }
            else if (room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}})) {
                let walls = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});
                if (numberOfDismantlers < walls.length) {
                    name = spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'dismantler', working: false});
                }
            }
            if (spawn.spawning) {
                spawn.spawning.setDirections([BOTTOM_LEFT, BOTTOM, LEFT]);
            }
        }
        
        
        if (spawn.room.terminal != undefined) {
            // Terminal trade execution
            tradeResource = 0;
            if (spawn.room.terminal.store[RESOURCE_HYDROGEN]) {
                tradeResource = RESOURCE_HYDROGEN;
                sellAmount = spawn.room.terminal.store[tradeResource];
                minPrice = 20;
            }
            else if (spawn.room.terminal.store[RESOURCE_UTRIUM]) {
                tradeResource = RESOURCE_UTRIUM;
                sellAmount = spawn.room.terminal.store[tradeResource];
                minPrice = 10;
            }
            else if (spawn.room.terminal.store[RESOURCE_CATALYST]) {
                tradeResource = RESOURCE_CATALYST;
                sellAmount = spawn.room.terminal.store[tradeResource];
                minPrice = 20;
            }
            // Terminal trade execution
            if (tradeResource != 0) {
                if (spawn.room.terminal.store[RESOURCE_ENERGY] >= 200 && spawn.room.terminal.store[tradeResource] >= 100) {
                    let orders = Game.market.getAllOrders(order => order.resourceType == tradeResource &&
                                                order.type == ORDER_BUY);
                    //console.log(tradeResource, ' buy orders found: ' + orders.length);
                    orders = _.sortBy(orders, "price");
                    orders.reverse();
                    if (sellAmount > orders[0].amount) {
                        sellAmount = orders[0].amount;
                    }
                    //console.log('Best price: ' + orders[0].price);
                    if (orders[0].price > minPrice) {
                        let result = Game.market.deal(orders[0].id, sellAmount, spawn.room.name);
                        if (result == 0) {
                            console.log('Order completed successfully: ', tradeResource, orders[0].price);
                        }
                    }
                }
            }
        }
    }
    console.log(Game.cpu.getUsed());
    console.log(Game.cpu.bucket)
};