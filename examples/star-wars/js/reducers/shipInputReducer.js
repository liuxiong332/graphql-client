import Immutable from 'immutable';
import { Reducer } from 'flux-reducer';
import factions from '../models/faction';

export default class ShipInputReducer extends Reducer({
  shipName: '',
  factionId: '',
  factions: new Immutable.List,
}) {
  constructor() {
    super(...arguments);
    this.addDisposable(factions.onAdd(this.onAdd.bind(this)));
  }

  onAdd(faction) {
    this.trigger(this.set('factions', this.factions.push(faction)));
  }

  changeShipName(name) {
    this.trigger(this.set('shipName', name));
  }

  changeFactionId(id) {
    this.trigger(this.set('factionId', id));
  }

  addShip(ship) {
    let faction = factions.getById(ship.factionId);
    faction && faction.addShip(ship);
  }
}
