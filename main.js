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
let roleDistrubitor = require('role.distrubitor');
let roleMineralHarvester = require('role.mineralHarvester');
let roleLongDistanceHarvester = require('role.longDistanceHarvester');
let roleAttacker = require('role.attacker');

// Game.creeps."creep".drop(RESOURCE_ENERGY)

// Game.market.deal('64a08660a7e81c796f8d3206', 1000);
/*

Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: ACCESS_KEY,
    price: 675000000,
    totalAmount: 1,
});

if(Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
}

{
    let pixelOrders = Game.market.getAllOrders({type: ORDER_SELL, resourceType: PIXEL});
    pixelOrders = pixelOrders.filter(o => o.price < 50000 && o.remainingAmount > 0);
    if (pixelOrders.length === 0) { continue; }
    pixelOrders = _.sortBy(pixelOrders, "price");
    pixelOrders.reverse();
    let sellAmount = pixelOrders[0].amount;
    let result = Game.market.deal(pixelOrders[0].id, sellAmount);
    if (result == 0) {
        console.log('Pixel-order completed successfully: ', pixelOrders[0].price);
    }
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
        else if (creep.memory.role == 'distrubitor') {
            roleDistrubitor.run(creep);
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
        let numberOfDistrubitor = _.sum(creepsInRoom, (c) => c.memory.role == 'distrubitor');
        let numberOfMineralHarvester = _.sum(creepsInRoom, (c) => c.memory.role == 'mineralHarvester');
        let numberOfDismantlers = _.sum(creepsInRoom, (c) => c.memory.role == 'dismantler');

        let energy = spawn.room.energyCapacityAvailable;

        // if none of the above caused a spawn command check for other roles
        let target = spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target == undefined) {
            if (numberOfHarvesters == 0 && numberOfLorries == 0) {
                if (room.energyAvailable > 3000) {
                    name = spawn.createLorry(room.energyAvailable);
                }
                else {
                    name = spawn.createCustomCreep(room.energyAvailable, 'harvester');
                }
            }
            else if (numberOfLorries < spawn.memory.minLorries) {
                // try to spawn one
                name = spawn.createLorry(energy);
            }
            // if not enough harvesters
            else if (numberOfHarvesters < spawn.memory.minHarvesters) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'harvester');
            }
            // if not enough repairers
            else if (numberOfRepairers < 1 /*spawn.memory.minRepairers*/ ) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'repairer');
            }
            // if not enough builders
            /*else if (numberOfBuilders < spawn.memory.minBuilders) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'builder');
            }*/
                // if not enough upgraders
            else if (numberOfUpgraders < Math.floor(spawn.room.storage.store[RESOURCE_ENERGY] / 100000)) {
                // try to spawn one
                name = spawn.createCustomCreep(energy, 'upgrader');
            }
            else if (numberOfDistrubitor < spawn.memory.minDistrubitors) {
                if (room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TERMINAL}})) {
                    // try to spawn one
                    name = spawn.createDistrubitor(energy, 'distrubitor');
                }
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
            else if (spawn.room.terminal != undefined && spawn.room.terminal.store.getFreeCapacity() > 25000) {
                let minerals = spawn.room.find(FIND_MINERALS);
                let mineral = minerals[0];
                if (mineral.mineralAmount != 0 && numberOfMineralHarvester < 1) {
                    name = spawn.createMineralHarvester(energy, 'mineralHarvester');
                }
            }
            /*
            else if (room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}})) {
                let walls = room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});
                if (numberOfDismantlers < 3 && walls.length > 1) {
                    name = spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], null, {role: 'dismantler', working: false});
                }
            }
            */
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
        }


        if (Game.cpu.bucket >= 1000 && spawn.room.terminal != undefined && spawn.room.terminal.cooldown == 0) {
            for (let resource in spawn.room.terminal.store) {
                if (resource == RESOURCE_ENERGY || resource == RESOURCE_POWER) { continue; }
                try {
                    let history = Game.market.getHistory(resource);
                    let list = [];
                    for (let e of history) {
                        // console.log(e["avgPrice"], e["stddevPrice"]);
                        if (e["avgPrice"] < e["stddevPrice"]) { continue; }
                        list.push(e["avgPrice"]);
                    }
                    if (list.length < 4) { continue; }
                    let minPrice = list.reduce((a, b) => a + b, 0) / list.length;
                    let orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resource});
                    let viable = orders.filter(o => o.price > minPrice && o.remainingAmount > 0);
                    orders = []; // not for use later
                    if (viable.length === 0) {
                        // console.log("no buy orders", resource);
                        continue; }
                    viable = _.sortBy(viable, "price");
                    viable.reverse();
                    let sellAmount = Math.min(viable[0].amount, spawn.room.terminal.store[resource]);
                    console.log(resource, ' Best price: ' + viable[0].price);
                    let result = Game.market.deal(viable[0].id, sellAmount, spawn.room.name);
                    if (result == 0) {
                        console.log('Order completed successfully: ', resource, viable[0].price);
                    }
                }
                catch ( err ) {
                    // it did not succeed, something is wrong with this resource.
                    // continues without trading
                }
            }

        }
    }
    console.log(Game.cpu.getUsed());
    console.log(Game.cpu.bucket)
};