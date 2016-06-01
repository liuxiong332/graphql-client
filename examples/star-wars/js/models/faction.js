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

  observe(callback) {
    callback(this.factions.slice(0));
    return this.emitter.on('add', callback);
  }
}

const factions = new FactionCollection;
export default factions;
