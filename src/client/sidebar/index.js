import React, { render } from 'preact';
import App from './components/App';

if (module.hot) require('preact/debug')

render(<App />, document.getElementById('index'));
