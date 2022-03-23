import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Details from './Components/Details';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Home/> }/>
          <Route path='/details' element={ <Details/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
