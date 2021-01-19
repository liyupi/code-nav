import React from 'react'
import {Root, Routes} from 'react-static'
import {Router} from 'components/Router'
import {Spin} from "antd";
import 'antd/dist/antd.min.css'
import './app.css'

function App() {

  // loading
  const fallbackView = <div className="center-container"><Spin size="large" /></div>;

  return (
    <Root>
      <React.Suspense fallback={fallbackView}>
        <Router>
          <Routes path="*" />
        </Router>
      </React.Suspense>
    </Root>
  )
}

export default App;
