import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import AccountForm from './AccountForm';
import ChildForm from './ChildForm';
import Nav from './Nav';

const AccountPage = (props) => {
    return (
        <div>
            <Nav {...props}></Nav>
                <Container fluid className='my-5 px-3'>
                    <Row className='justify-content-between'>
                        <Col className='col-lg-6'>
                            <AccountForm></AccountForm>
                        </Col>
                        <Col className='col-lg-6'>
                            <ChildForm></ChildForm>
                        </Col>
                    </Row>
                </Container>
        </div>  
    )
}

export default AccountPage