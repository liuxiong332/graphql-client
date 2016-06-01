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

class ReducerComponent extends React.Component {
  initWithReducer(reducer) {
    this.subscription = reducer.subscribe(onHandleChange);
    this.setState({reducer})

    var onHandleChange = (newRd) => {
      this.subscription.dispose();
      this.subscription = newRd.subscribe(onHandleChange);
      this.setState({reducer: newRd});
    }
  }

  dispose() {
    this.subscription.dispose();
  }
}

class Wrapper extends ReducerComponent {
  constructor() {
    super();
    this.initWithReducer(new TotalReducer);
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    let reducer = this.state.reducer;
    let factions = reducer.get('factions');
    let shipInput = reducer.get('shipInput');
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
