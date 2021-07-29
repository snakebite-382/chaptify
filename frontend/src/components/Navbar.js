import { Component } from 'react';
import NavItem from './Nav-item';
import logo from '../img/logo.png';
import '../css/nav.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLinkID: 0
        };
    }

    render () {
        let itemClick = (ID) => {
            this.setState({activeLinkID: ID});
        }

        return (
            <div className="nav">
                <div className="nav-inner">
                    <div className="nav-left">
                        <div className="nav-logo">
                            <img src={logo} alt="" className="nav-logo-img" />
                        </div>
                    </div>
                    <div className="nav-right">
                        <ul className="nav-list">
                            <NavItem path="/" page="Home" ID={0} activeID={this.state.activeLinkID} onClick={itemClick}/>
                            <NavItem path="/signup" page="Signup" ID={1} activeID={this.state.activeLinkID} onClick={itemClick}/>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};

export default Navbar;