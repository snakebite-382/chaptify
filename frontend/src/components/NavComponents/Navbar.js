import { Component } from 'react';
import NavItem from './Nav-item';
import LoginOrOutLink from '../AuthComponents/Login-or-out-link';
import logo from '../../img/logo.png';
import '../../css/nav.scss';

class Navbar extends Component {
    render () {
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
                            <NavItem path="/" page="Home"/>
                            <li className="nav-item">
                                <span className="nav-link"><LoginOrOutLink /></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};

export default Navbar;