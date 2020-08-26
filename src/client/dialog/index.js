import React, { render } from 'preact';
import SheetEditor from './components/SheetEditor';

import './styles.css';

if (module.hot) require('preact/debug')

render(<SheetEditor />, document.getElementById('index'));
