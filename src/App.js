
import { BrowserRouter, Route, RouterContext } from './lib/my-react-router/index'
import About from './pages/About';
import Home from './pages/Home';
import Users from './pages/Users';
import Counter from './pages/Counter';
function App() {
  return (
    <BrowserRouter>
      <RouterContext.Consumer>
        {
          (router) => {
            return (
              <>
                <button onClick={router.goPath.bind(null,'/users')}>Users</button>
                <button onClick={router.goPath.bind(null,'/home')}>Home</button>
                <button onClick={router.goPath.bind(null,'/about')}>About</button>
                <button onClick={router.goPath.bind(null,'/counter')}>counter</button>


                <Route path="/users" component={Users}></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/about" component={About}></Route>
                <Route path="/counter" component={Counter}></Route>
                
              </>
            )
          }
        }
      </RouterContext.Consumer>

    </BrowserRouter>
  );
}

export default App;
