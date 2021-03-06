import React, { useContext, useState } from 'react';
import { Nav, NavDropdown, Container, Row, Col} from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext';

export default (props) => {
    const { signOutUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState(props.location.pathname);

    const handleSelect = (eventKey) => {
        switch(eventKey) {
            case '/':
                setActiveTab(eventKey);
                return props.history.push(eventKey);
            case '/logs':
                setActiveTab(eventKey);
                return props.history.push(eventKey);
            case '/account':
                setActiveTab(eventKey);
                return props.history.push(eventKey);
            case 'signOut':
                return signOutUser();
        }
    }

    return ( 
        <Container>
                    <Nav fill variant='tabs' activeKey={activeTab} onSelect={handleSelect} className='m-3'>
                        <Container>
                            <Row>
                                <Col lg={4} sm={12}>
                                    <Nav.Item>
                                        <Nav.Link eventKey='/' className='h3'>Dashboard</Nav.Link>
                                    </Nav.Item>
                                </Col>
                                <Col lg={4} sm={12}>
                                    <Nav.Item>
                                        <Nav.Link eventKey='/logs' className='h3'>Logs</Nav.Link>
                                    </Nav.Item>
                                </Col>
                                <Col lg={4} sm={12}>
                                    <NavDropdown active={activeTab === '/account'} title="Account" className='h3'>
                                        <NavDropdown.Item eventKey='/account' className='h6'>Details</NavDropdown.Item>
                                        <NavDropdown.Item eventKey='signOut' className='h6'>Sign Out</NavDropdown.Item>
                                    </NavDropdown> 
                                </Col>
                            </Row>
                        </Container>
                    </Nav>
        </Container>
    );
}