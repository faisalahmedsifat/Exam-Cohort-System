// Core Packages
import { StrictMode } from 'react';
import ReactDOM from 'react-dom'

// Utils
import config from './utils/config'

// Redux 
import store from './redux/store'
import { Provider } from 'react-redux'

// Google Auth
import { GoogleOAuthProvider } from '@react-oauth/google';

// Fonts
import "@fontsource/varela-round";

// Stylesheets
import './index.css';

// Components
import App from './App';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={config.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
