import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'



import Menu from './component/menu'
import JoinGame from './component/joinGame'
import GameMenu from './component/gameMenu'
import Game from './component/game'


const App = () => {
  return(
  <Router>
      <Route path="/" exact component= {Menu}/>
      <Route path="/joinGame" component= {JoinGame}/>
      <Route path="/gameMenu" component = {GameMenu}/>
      <Route path="/game" component ={Game}/>
  </Router>
  )
}

export default App;
