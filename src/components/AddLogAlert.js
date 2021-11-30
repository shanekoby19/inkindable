import React from 'react';
import { Row, Col, Alert, Button, Container } from 'react-bootstrap';


const AddLogAlert = (props) => {
    const showAddLogForm = () => {
        props.history.push('/')
    }

    return (
        <Container>
            <Row className='align-items-end'>
                <Col>
                    <Alert variant='warning'>Uh-oh, it looks like we didn't find any logs for your children. Please add a log then check back.</Alert>
                    <Button variant='primary' onClick={showAddLogForm}>Add Log</Button>
                </Col>
            </Row>
        </Container>
    )
}

export default AddLogAlert;