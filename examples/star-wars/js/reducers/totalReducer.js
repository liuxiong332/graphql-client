import { Reducer } from 'flux-reducer';
import ShipInputReducer from './shipInputReducer';
import FactionsReducer from './factionReducer';

export default class TotalReducer extends Reducer({
  factions: new FactionsReducer,
  shipInput: new ShipInputReducer,
}) {
  constructor() {
    super(...arguments);
    this.monitorAllValues();
  }
}
