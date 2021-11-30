import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import AccountForm from './AccountForm';
import AddChildAlert from './AddChildAlert';
import AddChildForm from './AddChildForm';
import EditChildForm from './EditChildForm';
import EditChildList from './EditChildList';
import Nav from './Nav';

const AccountPage = (props) => {
    const [showAddChildForm, setShowAddChildForm] = useState(false);
    const [showAddChildAlert, setShowAddChildAlert] = useState(props.currentParent.children.length === 0);
    const [showEditChildList, setShowEditChildList] = useState(props.currentParent.children.length !== 0);
    const [showEditChildForm, setShowEditChildForm] = useState(false);
    const [defaultEditFormState, setDefaultEditFormState] = useState({
        dob: null,
        fName: null,
        lName: null,
        delegate: null,
    })

    return (
        <div>
            <Nav {...props}></Nav>
            <Container fluid className='my-5 px-3'>
                <Row className='justify-content-between'>
                    <Col lg={6} xs={12}>
                        <AccountForm {...props}></AccountForm>
                    </Col>
                    <Col lg={6} xs={12}>
                        { 
                            showAddChildAlert ? 
                            <AddChildAlert 
                            {...props}
                            setShowAddChildForm={setShowAddChildForm}
                            setShowAddChildAlert={setShowAddChildAlert}    
                            ></AddChildAlert> : null
                        }
                        {
                            showAddChildForm ? 
                            <AddChildForm
                                {...props}
                                setShowEditChildList={setShowEditChildList}
                                setShowAddChildAlert={setShowAddChildAlert}
                                setShowAddChildForm={setShowAddChildForm}
                            ></AddChildForm> : null
                        }
                        { 
                            showEditChildList ?
                            <EditChildList 
                            setShowEditChildList={setShowEditChildList}
                            setShowEditChildForm={setShowEditChildForm}
                            setShowAddChildForm={setShowAddChildForm}
                            setDefaultEditFormState={setDefaultEditFormState}
                            ></EditChildList> : null
                        }
                        {
                            showEditChildForm ?
                            <EditChildForm 
                                {...props}
                                childData={defaultEditFormState}
                                setShowEditChildForm={setShowEditChildForm}
                                setShowEditChildList={setShowEditChildList}
                            ></EditChildForm> : null
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

export default connect(mapStateToProps)(AccountPage);