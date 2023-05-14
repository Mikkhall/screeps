module.exports = {
    run: function (creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
                let exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) => s.getUsedCapacity() > 0
            });

            if (target != undefined) {
                for(const resourceType in target.store) {
                    if (creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
        else {
            if (creep.memory.home != undefined && creep.room.name != creep.memory.home) {
                let exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TERMINAL
                            ||  s.structureType == STRUCTURE_TERMINAL)
                            &&  s.getFreeCapacity > 0
            });

            for(const resourceType in creep.carry) {
                creep.transfer(target, resourceType);
            }
        }
    }
};

/*

for(const resourceType in target.store[]) {
    creep.drop(resourceType);
}

 */

