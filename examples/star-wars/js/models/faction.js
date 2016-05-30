import {Emitter} from 'event-kit';

export class Faction {
  constructor({id, name, ships}) {
    this.id = id;
    this.name = name;
    this.ships = ships || [];
    this.emitter = new Emitter;
  }

  addShip(ship) {
    this.ships.push(ship);
    this.emitter.emit('add-ship', ship);
  }

  onAddShip(callback) {
    this.emitter.on('add-ship', callback);
  }
}

export class FactionCollection {
  constructor(factions) {
    this.factions = factions || [];
    this.idToFaction = {};
    this.factions.forEach((faction) => {
      this.idToFaction[faction.id] = faction;
    });
    this.emitter = new Emitter;
  }

  add(faction) {
    if (!(faction instanceof Faction)) {
      faction = new Faction(faction);
    }
    factions.push(faction);
    this.idToFaction[faction.id] = faction;
    this.emitter.emit('add', faction);
  }

  getById(id) {
    return this.idToFaction[id];
  }

  onAdd(callback) {
    this.emitter.on('add', callback);
  }
}

export default factions = new FactionCollection;
