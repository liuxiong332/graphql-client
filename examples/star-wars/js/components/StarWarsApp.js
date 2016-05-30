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

import StarWarsShip from './StarWarsShip';

export default class StarWarsApp extends React.Component {
  handleAddShip() {
    const {shipInput: {shipName, factionId}, onAddShip} = this.props;
    onAddShip({shipName, factionId});
  }

  handleInputChange(e) {
    var shipName = e.target.value;
    this.props.onNameChange(shipName);
  }

  handleSelectionChange(e) {
    var factionId = e.target.value;
    this.props.onSelectionChange(factionId);
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
                  <input type="text" value={shipInput.shipName} onChange={this.handleInputChange.bind(this)} />
                </li>
                <li>
                  Faction:
                  <select onChange={this.handleSelectionChange.bind(this)} value={shipInput.factionId}>
                    {shipInput.factions.map(({id, name}) =>
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
  factions: React.PropTypes.object,
  shipInput: React.PropTypes.object,
  onSelectionChange: React.PropTypes.func,
  onNameChange: React.PropTypes.func,
  onAddShip: React.PropTypes.func,
};
