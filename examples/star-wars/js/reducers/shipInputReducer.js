import Immutable from 'immutable';
import factions from '../models/faction';

export default class ShipInputReducer extends Immutable.Record({
  shipName: '',
  factionId: '',
  factions: new Immutable.List,
}) {
  constructor() {
    super();
    factions.onAdd(this.onAdd.bind(this));
  }

  subscribe(callback) {
    this._subscriber = callback;
  }

  onAdd(faction) {
    if (this._subscriber) {
      let factions = this.get('factions');
      this._subscriber(this.set('factions', factions.push(faction)));
    }
  }

  changeShipName(name) {
    this._subscriber && this._subscriber(this.set('shipName', name));
  }

  changeFactionId(id) {
    this._subscriber && this._subscriber(this.set('factionId', id));
  }

  addShip(ship) {
    let faction = factions.getById(ship.factionId);
    faction && faction.addShip(ship);
  }
}
