import Immutable from 'immutable';
import { Reducer, ArrayReducer } from 'flux-reducer';
import factions from '../models/faction';

class FactionReducer extends Reducer({
  id: null,
  name: '',
  ships: new Immutable.List
}) {
  constructor(values) {
    if (Array.isArray(values.ships)) {
      values.ships = new Immutable.List(values.ships);
    }
    super(values);
  }

  initWithFaction(faction) {
    this.faction = faction;
    this.addDisposable(faction.onAddShip(this.onAddShip.bind(this)));
  }

  addShip(ship) {
    this.faction.addShip(ship);
  }

  onAddShip(ship) {
    this.trigger(this.set('ships', this.ships.push(ship)));
  }
}

export default class FactionsReducer extends ArrayReducer {
  static create() {
    let reducers = FactionsReducer.createFactionReducers(factions.getAll());
    return new FactionsReducer(reducers);
  }

  static createFactionReducers(factionList) {
    return factionList.map((faction) => {
      return FactionsReducer.createFactionReducer(faction);
    });
  }

  static createFactionReducer(faction) {
    return new FactionReducer(faction).initWithCallback(fr => {
      fr.initWithFaction(faction);
    });
  }

  constructor(values) {
    super(values);
    this.monitorAllValues();
    this.addDisposable(factions.onAdd(this.onAdd.bind(this)));
  }

  addFaction(faction) {
    factions.add(faction);
  }

  onAdd(faction) {
    let reducer = FactionsReducer.createFactionReducer(faction);
    this.trigger(this.push(reducer));
  }
}
