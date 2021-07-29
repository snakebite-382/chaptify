import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from './pages/Home';
import Error404 from "./pages/404";
import Navbar from "./components/Navbar";

function App() {
    return (
        <div className = "App" >
            <Router>
                <Navbar/>
                <Switch>
                    <Route exact path="/">
                        <Home/>
                    </Route>
                    <Route path="*">
                        <Error404/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;