import { Component } from 'react';
import { Link } from 'react-router-dom';

class Error404 extends Component {
    render () {
        return (
            <>
            <h1>Error 404</h1>
            <Link to="/">Return Home</Link>
            </>
        );
    }
}

export default Error404;