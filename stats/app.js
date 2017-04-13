/* global window,document */
import React, {Component} from 'react';
import {render} from 'react-dom';
import { Header, Button, Popup, Icon } from 'semantic-ui-react';
import Map from './map.js';

const styles = {
  title1: {
    position: 'absolute',
    top: 15,
    left: 15,
    color: '#fff',
    zIndex: 1000,
    fontSize: '3rem',
    fontWeight: '200'
  },
  title2: {
    position: 'absolute',
    top: 20,
    left: 75,
    margin: 0,
    color: '#fff',
    zIndex: 1000,
    fontWeight: 'normal'
  },
  buttongroup: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    zIndex: 1000,
  },
  button: {
    color: "#fff",
    backgroundColor: "rgba(0, 0,0, 0.8)" 
  },
  infoIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    color: '#fff',
    zIndex: 1000,
  },
  popup: {
    borderRadius: 0,
    background: '#000',
    opacity: 0.8,
    padding: '1.5em'
  }
};

class Root extends Component {
  render() {

    return (
      <div>
        <Header as='h1' style={styles.title1}>24</Header>
        <Header as='h3' style={styles.title2}>時間降水量</Header>
        <Map />
        <Button.Group size='tiny' color='black' style={styles.buttongroup}>
          <Button style={styles.button}>1h</Button>
          <Button style={styles.button}>3h</Button>
          <Button style={styles.button}>24h</Button>
          <Button style={styles.button}>48h</Button>
          <Button style={styles.button}>72h</Button>
        </Button.Group>
        <Popup
          trigger={<Icon name='info circle' style={styles.infoIcon}/>}
          content={<div>
            <a href='http://www.data.jma.go.jp/obd/stats/data/mdrr/docs/csv_dl_readme.html' style={{color:"#fff"}}>最新の気象データCSV</a> <a href='http://www.data.jma.go.jp/'>©気象庁</a>
            <br/><br/>
            <a href='https://www.mapbox.com/about/maps/'>©Mapbox</a> <a href='http://www.openstreetmap.org/about/'>©OpenStreetMap</a>
          </div>}
          style={styles.popup}
          on='click'
          inverted
        />
      </div>
    );
  }
}

render(<Root />, document.body.appendChild(document.createElement('div')));
