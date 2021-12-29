import { React, Component} from 'react';
import NavItem from '../../../NavComponents/Nav-item';
import ChevronLeft from '../../../../img/icons/chevron-left.svg';

class Navbar extends Component{
    render() {
        return (
            <div className="nav">
                <div className="nav-inner triple extra-padded">
                    <ul className="nav-left nav-list">
                        <NavItem path="/" page={<><img src={ChevronLeft} alt=""/> <span>Return Home</span></>}/>
                    </ul>
                    <ul className="nav-middle nav-list">
                        <span className="nav-item">{this.props.roomName}</span>
                    </ul>
                    <ul className="nav-right nav-list">
                        <span className="nav-item">{this.props.username}</span>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Navbar;