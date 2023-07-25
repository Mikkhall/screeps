module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.store.getFreeCapacity() == 0) {
            // switch state
            creep.memory.working = true;
        }

        if (creep.store.getFreeCapacity() == creep.store.getCapacity() && creep.ticksToLive <= 50) {
            creep.suicide();
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            if (creep.store[RESOURCE_ENERGY] < creep.store.getUsedCapacity()) {
                let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) =>  (s.structureType == STRUCTURE_TERMINAL && s.store.getUsedCapacity() < s.store.getCapacity())
                        || (s.structureType == STRUCTURE_STORAGE && s.store.getUsedCapacity() < s.store.getCapacity())
                });

                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    for(const resourceType in creep.carry) {
                        if (creep.transfer(structure, resourceType) == ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveTo(structure);
                        }
                    }
                    return;
                }
            }
            // find closest spawn, extension or tower which is not full
            let structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                        || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
            });
            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
                return;
            }

            if (structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) =>  (s.structureType == STRUCTURE_TERMINAL && s.store[RESOURCE_ENERGY] < s.store.getCapacity() / 6)});

                if (structure == undefined) {
                    structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) =>  (s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < s.store.getCapacity())});
                }
                if (structure == undefined) {
                    structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) =>  (s.structureType == STRUCTURE_TERMINAL && s.store[RESOURCE_ENERGY] < s.store.getCapacity())});
                }
                // if we found one
                if (structure != undefined) {
                    // try to transfer energy, if it is not in range
                    for(const resourceType in creep.carry) {
                        if (creep.transfer(structure, resourceType) == ERR_NOT_IN_RANGE) {
                            // move towards it
                            creep.moveTo(structure);
                        }
                    }
                }
            }
        }
        // if creep is supposed to get energy
        else {
            let container = creep.pos.findClosestByPath(FIND_RUINS, {
                filter: s =>    s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined) {
                for(let resourceType in container.store) {
                    if (creep.withdraw(container, resourceType) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(container);
                    }
                }
                return;
            }

            // find closest container
            container = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (s) => (s.energy >= 500)});
            if (container != undefined) {
                if (creep.pickup(container) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 500
            });

            if (container == undefined) {
                container = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (s) => (s.energy >= 100)});
            }
            if (container == undefined) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 100
                });
            }

            if (container == undefined) {
                if (creep.room.storage != undefined && creep.room.storage.store[RESOURCE_ENERGY] > 500) {
                    container = creep.room.storage;
                }
                else if (creep.room.terminal != undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 10000) {
                    container = creep.room.terminal;
                }
            }


            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
        }
    }
};