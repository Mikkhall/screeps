module.exports = {
    run: function (creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }


    }
};