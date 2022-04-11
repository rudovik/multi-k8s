import logo from './logo.svg'
import './App.css'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { OtherPage } from './OtherPage'
import { Fib } from './Fib'

function App() {
  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <h1>Fib Calculator version KUBERNETES!</h1>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React!!
          </a>
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other Page</Link>
        </header>
        <Routes>
          <Route exact path='/' element={<Fib />} />
          <Route path='/otherpage' element={<OtherPage />}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
