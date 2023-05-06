var roleHarvester = require('role.harvester');
module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if (_.sum(creep.carry) != creep.carryCapacity) {
            creep.memory.working = false;
        }
        if (creep.ticksToLive <= 50) {
            if ((_.sum(creep.carry) != 0)) {
                creep.memory.working = true
            }
            else {
                creep.suicide();
            }
        }
        
        if (creep.memory.working == false) {
            var target;
        
            if (creep.memory.depositId) {
                target = Game.getObjectById(creep.memory.depositId);
            } else {
                var targets = creep.room.find(FIND_MINERALS);
                target = targets[0];
                creep.memory.depositId = target.id;
                creep.memory.mineralType = target.mineralType;
            } if (target.mineralAmount !=  0) {
                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.memory.working == true;
            }
        } else {
            if (_.sum(creep.carry) != 0) {
                for(const resourceType in creep.carry) {
                    if (creep.transfer(creep.room.terminal, resourceType) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(creep.room.terminal);
                    }
                }
            }
        }
    }
};