import React from 'react';
import { Row, Col, Alert, Button, Container } from 'react-bootstrap';


const AddChildAlert = (props) => {
    const showAddChildForm = () => {
        if(props.location.pathname === `/logs`) {
            props.history.push(`/account`);
        }

        if(props.location.pathname === `/account`) {
            props.setShowAddChildForm(true);
            props.setShowAddChildAlert(false);
        }
    }

    return (
        <Container>
            <Row className='border-bottom border-3 mb-5'>
                <h2 className='text-center display-4'>Add Child</h2>
            </Row>
            <Row className='align-items-end'>
                <Col>
                    <Alert variant='warning'>Uh-oh, it looks like we didn't find any children for your profile. Please add a child.</Alert>
                    <Button variant='primary' onClick={showAddChildForm}>Add Child</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default AddChildAlert;