module.exports = {
    run: function (creep) {
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            let exit = creep.room.findExitTo(creep.memory.target);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            return;
        }

        let target = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if (target == undefined) {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

/*
Game.spawns['Spawn3'].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], 'attacker1', {
    memory: {role: 'attacker', target: 'E41S2'}
});
*/
