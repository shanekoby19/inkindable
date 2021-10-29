import React from 'react';
import { connect } from 'react-redux';
import Nav from './Nav'

const Dashboard = (props) => {
    return (
        <div>
            <Nav {...props}></Nav>
            { props.currentParent && <h2>Welcome, {props.currentParent.fName}</h2> } 
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect(mapStateToProps)(Dashboard);