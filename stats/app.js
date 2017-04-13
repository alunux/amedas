/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';

import {request, json as requestJSON} from 'd3-request';
import {csvParseRows} from 'd3-dsv';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGF0dGlpIiwiYSI6ImNqMWFrZ3ZncjAwNmQzM3BmazRtNngxam8ifQ.DNMc6j7E4Gh7UkUAaEAPxA'; // eslint-disable-line

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 500,
        height: 500
      },
      data: null
    };

    requestJSON('amedas-point.json', (error, res) => {
      if (!error) {
        let point = res;
        this._loadCSV('pre24h00_rct.csv', point);
      }
    });
  }

  _loadCSV(url, point) {
    let time;
    request(url, (xhr) => {
      let data = csvParseRows(xhr.responseText, (d, i) => {
        if (i == 0) return null; // header
        if (i == 1) time = d.slice(4, 9);

        let id = d[0];
        return [
          point[id].name,
          +d[9], // value
          point[id].lat,
          point[id].lon
        ];
      });
      this.setState({ time, data });
    });
  } 

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onChangeViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onChangeViewport(viewport) {
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    });
  }

  _onHover({x, y, object}) {
    this.setState({x, y, hoveredObject: object});
  }

  _renderTooltip() {
    const {x, y, hoveredObject} = this.state;

    if (!hoveredObject) {
      return null;
    }
    const name = hoveredObject.points[0][0];
    const count = hoveredObject.count;

    return (
      <div className="tooltip"
           style={{left: x, top: y}}>
        <div>{`${name}`}</div>
        <div>{`${count.toFixed(1)} mm`}</div>
      </div>
    );
  }

  render() {
    const {viewport, data} = this.state;

    return (
      <MapGL
        {...viewport}
        mapStyle="mapbox://styles/tattii/cj1bob6hw003t2rr5s2svi3iq"
        perspectiveEnabled={true}
        onChangeViewport={this._onChangeViewport.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <div>
          {this._renderTooltip()}
          <DeckGLOverlay
            viewport={viewport}
            data={data || []}
            onHover={this._onHover.bind(this)}
          />
        </div>
      </MapGL>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
