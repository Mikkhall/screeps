module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            /*if (creep.room.storage) {
                creep.moveTo(creep.room.storage, {reusePath: 0});
            }*/
            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller, {reusePath: 10});
                //creep.moveTo(creep.room.controller, {reusePath: 0});
            }
        }
            // if creep is supposed to get energy
        else {
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s =>    (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 2000)
                            ||  (s.structureType == STRUCTURE_TERMINAL && s.store[RESOURCE_ENERGY] > 2000)
            });
            if (container == undefined) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s =>    s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 800
                });
            }
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container, {reusePath: 0});
                }
            }
            if (container == undefined) {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(source);
                }
            }
        }
    }
};