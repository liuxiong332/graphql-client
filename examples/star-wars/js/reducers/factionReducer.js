import Immutable from 'immutable';
import ArrayRecord from '../models/ArrayRecord';
import {CompositeDisposable} from 'event-kit';
import factions from '../models/faction';
import ReducerMixin from '../models/ReducerMixin';

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

export default class FactionsReducer extends ReducerMixin(ArrayRecord) {
  initialize() {
    super.initialize();
    this.addDisposable(factions.observe(this.onAdd.bind(this)));
    return this;
  }

  addFaction(faction) {
    factions.add(faction);
  }

  onAdd(factions) {
    if (!Array.isArray(factions)) {
      factions = [factions];
    }

    factions.forEach((faction) => {
      let factionRd = new FactionReducer(faction).initialize();
      factionRd.subscribe((newRd) => {
        let index = this.indexOf(factionRd);
        this.trigger(this.set(index, newRd));
      });
      this.trigger(this.push(factionRd));
    });
  }
}
