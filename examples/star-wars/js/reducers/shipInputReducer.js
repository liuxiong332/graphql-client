import { List } from 'immutable';
import { Reducer } from 'flux-reducer';
import factions from '../models/faction';

export default class ShipInputReducer extends Reducer({
  shipName: '',
  factionId: '',
  factions: new List,
}) {
  static create() {
    return new ShipInputReducer({
      factions: new List(factions.getAll()),
    });
  }

  constructor(values) {
    super(values || factions.getAll());
    this.addDisposable(factions.onAdd(this.onAdd.bind(this)));
  }

  onAdd(factionList) {
    if (!Array.isArray(factionList)) {
      factionList = [factionList];
    }
    this.trigger(this.set('factions', this.factions.push(...factionList)));
  }

  changeShipName(name) {
    this.trigger(this.set('shipName', name));
  }

  changeFactionId(id) {
    this.trigger(this.set('factionId', id));
  }

  addShip(ship) {
    let faction = factions.getById(ship.factionId);
    faction && faction.addShip({name: ship.shipName});
  }
}
