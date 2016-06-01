import Immutable from 'immutable';
import { Reducer, ArrayReducer } from 'flux-reducer';
import factions from '../models/faction';

class FactionReducer extends Reducer({
  name: '',
  ships: new Immutable.List
}) {
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
  constructor(values) {
    super(values || factions.getAll());
    this.monitorAllValues();
    this.addDisposable(factions.onAdd(this.onAdd.bind(this)));
  }

  addFaction(faction) {
    factions.add(faction);
  }

  onAdd(factionList) {
    if (!Array.isArray(factionList)) {
      factionList = [factionList];
    }

    let reducers = factionList.map((faction) => {
      return new FactionReducer().initWithCallback(fr => {
        fr.initWithFaction(faction);
      });
    });
    this.trigger(this.push(...reducers));
  }
}
