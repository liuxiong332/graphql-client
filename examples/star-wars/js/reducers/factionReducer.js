import Immutable from 'immutable';
import factions from '../models/faction';

class FactionReducer extends Immutable.Record({
  name: '',
  ships: new Immutable.List
}) {
  constructor(faction) {
    super(faction);
    this.faction = faction;
    faction.onAddShip(this.onAddShip.bind(this));
  }

  subscribe(callback) {
    this._subscriber = callback;
  }

  addShip(ship) {
    this.faction.addShip(ship);
  }

  onAddShip(ship) {
    this._subscriber && this._subscriber(
      this.set('ships', this.get('ships').push(ship))
    );
  }
}

export default class FactionsReducer extends Immutable.List {
  constructor() {
    super();
    factions.onAdd(this.onAdd.bind(this));
  }

  subscribe(callback) {
    this._subscriber = callback;
  }

  addFaction(faction) {
    factions.add(faction);
  }

  onAdd(faction) {
    if (this._subscriber) {
      let factionRd = new FactionReducer(faction);
      factionRd.subscribe((newRd) => {
        let index = this.indexOf(factionRd);
        this._subscriber(this.set(index, newRd));
      });
      this._subscriber(this.push(factionRd));
    }
  }
}
