import Immutable from 'immutable';
import ShipInputReducer from './shipInputReducer';
import FactionsReducer from './factionReducer';

export default class TotalReducer extends Immutable.Record({
  factions: new FactionsReducer,
  shipInput: new ShipInputReducer,
}) {
  constructor() {
    super();
    this.factions.subscribe(this.onFactionsChange.bind(this));
    this.shipInput.subscribe(this.onShipInputChange.bind(this));
  }

  subscribe(callback) {
    this._subscriber = callback;
  }

  onFactionsChange(factions) {
    this._subscriber && this._subscriber(this.set('factions', factions));
  }

  onShipInputChange(shipInput) {
    this._subscriber && this._subscriber(this.set('shipInput', shipInput));
  }
}
