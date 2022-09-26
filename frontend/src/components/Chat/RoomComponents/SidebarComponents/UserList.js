import {React, Component} from 'react';
import ChevronRight from '../../../../img/icons/chevron-right.svg'
import ChevronDown from '../../../../img/icons/chevron-down.svg'

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onlineExpanded: true,
            offlineExpanded: true
        }
    }

    toggleOnline  = () => {
        let newState = !this.state.onlineExpanded;
        this.setState({onlineExpanded: newState});
    }

    toggleOffline = () => {
        let newState = !this.state.offlineExpanded;
        this.setState({offlineExpanded: newState})
    }

    render() {
        return(
            <div className="users">
                <h2>Users</h2>
                <div className="lists">
                    <div className="online-container">
                        <span onClick={this.toggleOnline}><h3>Online</h3> <div className="circle"></div><img className="dropdown-toggle" src={!this.state.onlineExpanded ? ChevronRight : ChevronDown} alt="online dropdown toggle"/></span>
                        <ul className={"list " + (this.state.onlineExpanded ? "open": "closed")}>
                            {
                                this.props.users.map((user, index) => {
                                    if(user.online) {
                                        return(<li key={"online"+index.toString()}>{user.username}</li>)
                                    } else return (<></>)
                                })
                            }
                        </ul>
                    </div>
                    <div className="offline-container">
                        <span onClick={this.toggleOffline}><h3>Offline</h3> <div className="circle"></div> <img src={!this.state.offlineExpanded ? ChevronRight : ChevronDown} alt="" className="dropdown-toggle" /></span>
                        <ul className={"list " + (this.state.offlineExpanded ? "open" : "closed")}>
                        {
                                this.props.users.map((user, index) => {
                                    if(!user.online) {
                                        return(<li key={"offline"+index.toString()}>{user.username}</li>)
                                    } else return (<></>)
                                })
                            }
                        </ul>
                    </div>
                </div>

            </div>
        )
    }
}

export default UserList