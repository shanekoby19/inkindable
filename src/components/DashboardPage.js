import React, { useState, useEfect, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Nav from './Nav'

import AddChildAlert from './AddChildAlert';

const Dashboard = (props) => {
    useEffect(() => {
        if(props.currentParent.children) {
            return setShowAddChildAlert(props.currentParent.children.length === 0)
        }
    }, [props.currentParent.children]);

    const [showAddChildAlert, setShowAddChildAlert] = useState(false);
    

    return (
        <div>
            <Nav {...props}></Nav>
            <Container>
                <Row>
                    <Col>
                        { props.currentParent && <h2>Welcome {props.currentParent.fName}!</h2> }
                        {
                            showAddChildAlert &&
                            <AddChildAlert
                              {...props}
                            ></AddChildAlert> 
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect(mapStateToProps)(Dashboard);