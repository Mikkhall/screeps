module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        if (creep.memory.working == true && creep.store.getCapacity() == creep.store.getFreeCapacity()) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }

        if (creep.store.getFreeCapacity() == creep.store.getCapacity() && creep.ticksToLive <= 50) {
            creep.suicide();
        }

        if (creep.memory.working == true) {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_TERMINAL
            });
            if (container.store.getUsedCapacity([RESOURCE_ENERGY]) == container.store.getUsedCapacity()) {
                creep.memory.working = false;
            }
            if (container != undefined) {
                for(let resourceType in container.store) {
                    if (resourceType == RESOURCE_ENERGY) {
                        continue;
                    }
                    if (creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }

        else {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>  (s.structureType == STRUCTURE_STORAGE)
            });

            if (structure != undefined) {
                for(const resourceType in creep.carry) {
                    if (creep.transfer(structure, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }
            }
            else {
                creep.memory.working = false;
            }
        }
    }
};