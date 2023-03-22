module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 300);
            if (numberOfParts > 5) {
                numberOfParts = 5;
            }
            var body = [];
            for (let i = 0; i < numberOfParts*2; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts*1; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts*1; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createLongDistanceHarvester =
        function (energy, numberOfWorkParts, home, target, sourceIndex) {
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            var numberOfParts = Math.floor(energy / 100);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body
            return this.createCreep(body, undefined, {
                role: 'longDistanceHarvester',
                home: home,
                target: target,
                sourceIndex: sourceIndex,
                working: false
            });
        };
    
    // create a new function for StructureSpawn
    StructureSpawn.prototype.createClaimer =
        function (target) {
            return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target });
        };

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createMiner =
        function (sourceId, role) {
            return this.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], undefined,
                                    { role: role, sourceId: sourceId });
        };

    // create a new function for StructureSpawn
    StructureSpawn.prototype.createLorry =
        function (energy) {
            // create a body with twice as many CARRY as MOVE parts
            var numberOfParts = Math.floor(energy / 150);
            if (numberOfParts > 4) {
                numberOfParts = 4;
            }
            var body = [];
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the role 'lorry'
            return this.createCreep(body, undefined, { role: 'lorry', working: false });
        };
    StructureSpawn.prototype.createMineralHarvester =
        function (energy, roleName) {
            var numberOfParts = Math.floor(energy / 950);
            if (numberOfParts > 2) {
                numberOfParts = 2;
            }
            var body = [];
            for (let i = 0; i < numberOfParts * 5; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts * 2; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts * 7; i++) {
                body.push(MOVE);
            }
            return this.createCreep(body, undefined, { role: roleName, working: false });
        }
};