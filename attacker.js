module.exports = {
    run: function (creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }

        let target = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if (target == undefined) {
            target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        }
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};