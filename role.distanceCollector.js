module.exports = {
    run: function (creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        let target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => s.getUsedCapacity() > 0
        });
    }
};

/*

for(const resourceType in target.store[]) {
    creep.drop(resourceType);
}

 */

