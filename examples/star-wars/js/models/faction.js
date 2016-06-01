import {Emitter} from 'event-kit';

let id = 0;

export class Faction {
  constructor({id, name, ships}) {
    this.id = id;
    this.name = name;
    this.ships = ships || [];
    this.emitter = new Emitter;
  }

  addShip(ship) {
    var newShip = {name: ship.name, id: id++};
    this.ships.push(newShip);
    this.emitter.emit('add-ship', newShip);
  }

  onAddShip(callback) {
    return this.emitter.on('add-ship', callback);
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
    this.add({id: 1, name: 'First'});
    this.add({id: 2, name: 'Second'});
  }

  add(faction) {
    if (!(faction instanceof Faction)) {
      faction = new Faction(faction);
    }
    this.factions.push(faction);
    this.idToFaction[faction.id] = faction;
    this.emitter.emit('add', faction);
  }

  getById(id) {
    return this.idToFaction[id];
  }

  onAdd(callback) {
    return this.emitter.on('add', callback);
  }

  getAll() {
    return this.factions;
  }
}

const factions = new FactionCollection;
export default factions;
