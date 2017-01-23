module.exports = {
    run: function(creep) {
        if (creep.room.name == creep.memory.homeRoom) {
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        } else if (creep.room.name == creep.memory.targetRoom) {
            // if creep is bringing energy to a structure but has no energy left
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
                var damagedBuildings = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.hits < (s.hitsMax / 2)) ||
                                   (s.structureType == STRUCTURE_ROAD && s.hits < (s.hitsMax / 6))
                });

                if (damagedBuildings == undefined) {
                    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES,{});
                }

                if (damagedBuildings != undefined) {
                    creep.say('repair');
                    if (creep.repair(damagedBuildings) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedBuildings);
                    }
                } else if (constructionSite != undefined) {
                    creep.say('build');
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                } else {
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });

                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.say('transfer');
                        creep.moveTo(container);
                    } else {
                        creep.say('dropAll');
                        for(var resourceType in creep.carry) {
                            creep.drop(resourceType);
                        }
                    }
                }
            } else {
                let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                });

                if (container != undefined) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
                    var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        } else {
            var exit = creep.room.findExitTo(creep.memory.homeRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    }
};