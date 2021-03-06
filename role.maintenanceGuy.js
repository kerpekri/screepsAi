module.exports = {
    run: function(creep) {
        let wallAndRampartHp = 50000;

        if (creep.carry.energy == 0) {
            let energyOnFloor = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY, {
                filter: s => s.energy >= 50
            });

            if (energyOnFloor != undefined) {
                if (creep.pickup(energyOnFloor, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyOnFloor);
                }
            }
            else {
                var containerWithAlmostFullEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                       i.store[RESOURCE_ENERGY] > 1200
                });

                if (containerWithAlmostFullEnergy == undefined) {
                    var storage = creep.room.storage;
                }

                if (containerWithAlmostFullEnergy != undefined) {
                    if (creep.withdraw(containerWithAlmostFullEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.say('withdraw');
                        creep.moveTo(containerWithAlmostFullEnergy);
                    }
                } else if (storage != undefined) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                } else {
                    let container = Game.getObjectById(creep.memory.spawnContainerId);

                    if (container.store.energy > 200) {
                        if (container != undefined) {
                            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.say('withdraw');
                                creep.moveTo(container);
                            }
                        }
                    }
                    else {
                        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        // try to harvest energy, if the source is not in range
                        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            // move towards the source
                            creep.moveTo(source);
                        }
                    }
                }
            }
        }
        else {
            var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER)  &&
                                s.energy < s.energyCapacity &&
                                s.energy < 800
            });

            if (tower == undefined) {
                var spawnAndExtensions = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN     ||
                                    s.structureType == STRUCTURE_EXTENSION) &&
                                    s.energy < s.energyCapacity
                });
            }

            if (tower != undefined) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            }
            else if (spawnAndExtensions != undefined) {
                if (creep.transfer(spawnAndExtensions, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawnAndExtensions);
                }
            }
            else {
                var damagedBuilding = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < (s.hitsMax / 2) && s.structureType == STRUCTURE_CONTAINER) ||
                                   (s.hits < (s.hitsMax / 2) && s.structureType == STRUCTURE_EXTENSION) ||
                                   (s.hits < (s.hitsMax / 2) && s.structureType == STRUCTURE_STORAGE) ||
                                   (s.hits < (s.hitsMax / 2) && s.structureType == STRUCTURE_LINK) ||
                                   (s.hits < (s.hitsMax / 10) && s.structureType == STRUCTURE_ROAD)
                });

                if (damagedBuilding == undefined) {
                    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                }

                if (constructionSite == undefined && damagedBuilding == undefined) {
                    var damagedWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (i) => (i.structureType == STRUCTURE_WALL && i.hits < wallAndRampartHp) ||
                                       (i.structureType == STRUCTURE_RAMPART && i.hits < wallAndRampartHp)
                    });
                }

                if (damagedBuilding != undefined) {
                    if (creep.repair(damagedBuilding) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedBuilding);
                    }
                }
                else if (constructionSite != undefined) {
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.say('build');
                        creep.moveTo(constructionSite);
                    }
                } else if (damagedWall != undefined) {
                    if (creep.repair(damagedWall) == ERR_NOT_IN_RANGE) {
                        creep.say('rep wall');
                        creep.moveTo(damagedWall);
                    }
                }
                else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.say('upgrade');
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};