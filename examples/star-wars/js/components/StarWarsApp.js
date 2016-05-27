/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import { connect } from 'react-redux'

import StarWarsShip from './StarWarsShip';
import AddShipMutation from '../mutation/AddShipMutation';

class StarWarsApp extends React.Component {
  handleAddShip() {
    const {shipName, factionId, onAddShip} = this.props;
    onAddShip({shipName, factionId});
  }

  handleInputChange(e) {
    this.props.onNameChange({
      shipName: e.target.value,
    });
  }

  handleSelectionChange(e) {
    this.props.onSelectionChange({
      factionId: e.target.value,
    });
  }

  render() {
    const {factions, shipInput} = this.props;
    return (
      <div>
        <ol>
          {factions.map(faction => (
            <li key={faction.id}>
              <h1>{faction.name}</h1>
              <ol>
                {faction.ships.map((ship) => (
                  <li key={ship.id}><StarWarsShip ship={ship} /></li>
                ))}
              </ol>
            </li>
          ))}
            <li>
              <h1>Introduce Ship</h1>
              <ol>
                <li>
                  Name:
                  <input type="text" value={shipInput.name} onChange={this.handleInputChange.bind(this)} />
                </li>
                <li>
                  Faction:
                  <select onChange={this.handleSelectionChange.bind(this)} value={shipInput.factionId}>
                    {shipInput.factionInfos.map(({id, name}) =>
                      <option value={id}>{name}</option>
                    )}
                  </select>
                </li>
                <li>
                  <button onClick={this.handleAddShip.bind(this)}>Add Ship</button>
                </li>
              </ol>
            </li>
        </ol>
      </div>
    );
  }
}

StarWarsApp.propTypes = {
  factions: React.PropTypes.array,
  shipInput: React.PropTypes.object,
  onSelectionChange: React.PropTypes.func,
  onNameChange: React.PropTypes.func,
  onAddShip: React.PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectionChange({factionId}) {
      dispatch({type: 'ship-input/select-faction', factionId});
    },

    onNameChange({shipName}) {
      dispatch({type: 'ship-input/set-name', shipName});
    },

    onAddShip({shipName, factionId}) {
      dispatch({type})
    }
  }
}

export default let StarWarsAppWrapper = connect(
  null,
  mapDispatchToProps
)(StarWarsApp);
