let roleBuilder = require('role.builder');

module.exports = {
    // a function to run the logic for this role
    run: function (creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        if (creep.memory.working == true) {
            roleBuilder.run(creep);
        }
        else {
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {filter: {structureType: STRUCTURE_WALL}});
            if(target) {
                if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
};