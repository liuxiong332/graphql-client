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

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import TotalReducer from './reducers/totalReducer';
import StarWarsApp from './components/StarWarsApp';

class Wrapper extends React.Component {
  constructor() {
    super();
    var data = new TotalReducer;
    data.subscribe((newData) => {
      this.setState({data: newData});
    });
    this.state = {data};
  }

  render() {
    let data = this.state.data;
    let factions = data.get('factions');
    let shipInput = data.get('shipInput');
    return (
      <StarWarsApp factions={factions} shipInput={shipInput}
        onNameChange={shipInput.changeShipName.bind(shipInput)}
        onSelectionChange={shipInput.changeFactionId.bind(shipInput)}
        onAddShip={shipInput.addShip.bind(shipInput)}
      />
    );
  }
}

ReactDOM.render(
  <Wrapper />,
  document.getElementById('root')
);
