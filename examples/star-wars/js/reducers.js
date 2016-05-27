
function factionsApp(state = [], action) {
  switch (action.type) {
    case 'faction/add':
      let faction = Object.assign({name: '', ships: []}, action.faction);
      return state.concat([faction]);
    case 'faction/add-ship':
      let newState = state.slice(0);
      newState[action.factionIndex] = factionApp(state[action.factionIndex], {
        type: action.type,
        ship: action.ship,
      });
      return newState;
    default:
      return state;
  }
}

function factionApp(state = {}, action) {
  switch(action.type) {
    case 'faction/add-ship':
      return {
        ...state,
        ships: shipsApp(state.ships, {type: 'ship/add', ship: action.ship}),
      }
    default:
      return state;
  }
}

function shipsApp(state = [], action) {
  switch(action.type) {
    case 'ship/add':
      return [...state, action.ship];
    default:
      return state;
  }
}

const factionAddInitial = {shipName: '', factionId: 0, factions: []};
function factionAddApp(state = factionAddInitial, action) {
  switch(action.type) {
    case 'ship-input/set-name':
      return Object.assign({}, state, {shipName: action.shipName});
    case 'ship-input/select-faction':
      return Object.assign({}, state, {factionId: action.factionId});
    case 'ship-input/add-ship':
      return
    case 'faction/add':
      let faction = action.faction;
      let factions = [
        ...state.factions,
        {
          name: faction.name,
          id: faction.id,
        },
      ]
      return Object.assign({}, state, {factions});
    default:
      return state;
  }
}

export default function starApp(state = {factions: [], factionAdd: {}}, action) {
  return {
    factions: factionsApp(state.factions, action),
    factionAdd: factionAddApp(state.factionAdd, action);
  }
}
