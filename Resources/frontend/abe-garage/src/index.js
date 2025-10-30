import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Correct path to your context file
import { AuthProvider } from './Contexts/AuthContext';

// Assuming your CSS files are in src/assets/styles/
import "./assets/template_assets/css/responsive.css"
import "./assets/template_assets/css/style.css"
import './assets/styles/custom.css';
import "./assets/template_assets/css/bootstrap.css"
import "./assets/template_assets/css/color.css"
import "./assets/template_assets/css/custom-animate.css"
import "./assets/template_assets/css/bootstrap.css"
import "./assets/template_assets/css/animate.css"
import "./assets/template_assets/css/flaticon.css"
import "./assets/template_assets/css/fontawesome-all.css"
import "./assets/template_assets/css/hover.css"
// import "./assets/template_assets/css/jquery-ui.css"
import "./assets/template_assets/css/jquery.fancybox.min.css"
import "./assets/template_assets/css/jquery.touchspin.css"
// import "./assets/template_assets/css/line-awesome.css"
// import "./assets/template_assets/css/owl.css"
import "./assets/template_assets/css/polyglot-language-switcher.css"
import "./assets/template_assets/css/rtl.css"
// import "./assets/template_assets/css/scrollbar.css"
import "./assets/template_assets/css/stroke-gap.css"

import "./assets/styles/styles.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider wraps your entire App */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
