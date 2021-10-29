import React from 'react';
import Nav from './Nav';

export default (props) => {
    return (
        <div>
            <Nav {...props}></Nav>
            <h2>These are all my logs.</h2>
        </div>
    )
}