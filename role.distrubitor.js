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
            if (container != undefined) {
                for(let resourceType in creep.store) {
                    if (creep.transfer(container, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }

        else {
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) =>  (s.structureType == STRUCTURE_STORAGE)
            });
            if (structure.store.getUsedCapacity([RESOURCE_ENERGY]) == structure.store.getUsedCapacity()) {
                creep.memory.working = true;
            }
            else if (structure.store.getFreeCapacity() < 2000) {
                return;
            }
            if (structure != undefined) {
                for(const resourceType in structure.store) {
                    if (resourceType == RESOURCE_ENERGY) {
                        continue;
                    }
                    if (creep.withdraw(structure, resourceType) == ERR_NOT_IN_RANGE) {
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