// Core Packages
import { StrictMode } from 'react';
import ReactDOM from 'react-dom'

// Redux 
import store from './redux/store'
import { Provider } from 'react-redux'

// Google Auth
import { GoogleOAuthProvider } from '@react-oauth/google';

// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Stylesheets
import './index.css';

// Components
import App from './App';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
