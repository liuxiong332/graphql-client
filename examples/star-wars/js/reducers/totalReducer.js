import { Reducer } from 'flux-reducer';
import ShipInputReducer from './shipInputReducer';
import FactionsReducer from './factionReducer';

export default class TotalReducer extends Reducer({
  factions: null,
  shipInput: null,
}) {
  constructor(values) {
    super(values || {
      factions: FactionsReducer.create(),
      shipInput: ShipInputReducer.create(),
    });
    this.monitorAllValues();
  }
}
