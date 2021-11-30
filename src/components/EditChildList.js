import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { collection, query, where } from '@firebase/firestore';
import { getDocs } from 'firebase/firestore';
import moment from 'moment';

import db from '../firebase/firebase';


const EditChildList = (props) => {
    const [children, setChildren] = useState([]);

    useEffect(async () => {
        const tempChildData = [];
        const data = await getDocs(query(collection(db, `parents/${props.currentParent.refId}/children`)));
        data.forEach(child => tempChildData.push(child.data()));
        tempChildData.sort((first, second) => first.fName > second.fName ? 1 : -1);
        await setChildren(tempChildData);
    }, [])

    const handleUpdateChild = async (e) => {
        const childName = e.target.parentElement.parentElement.firstChild.children[0].innerHTML;
        const [fName, lName] = childName.split(` `);
        const q = query(collection(db, `parents/${props.currentParent.refId}/children`), where('fName', '==', fName));
        const selectedChild = await getDocs(q)
        let data = {};
        selectedChild.forEach(child => data = {...child.data()});
        props.setDefaultEditFormState({
            dob: moment(data.dob),
            fName: data.fName,
            lName: data.lName,
            delegate: data.delegate,
            center: data.center,
            classroom: data.classroom,
        });
        props.setShowEditChildList(false);
        props.setShowEditChildForm(true);
    }

    const showAddChildForm = () => {
        props.setShowAddChildForm(true);
        props.setShowEditChildList(false);
    }

    return (
        <Container className='my-lg-0 my-md-5 my-sm-5 my-xs-5'>
            <Row className='border-bottom border-3 mb-5'>
                <h2 className='text-center display-4'>{props.currentParent.children.length <= 1 ? `Edit Child` : `Edit Children`}</h2>
            </Row>
            { 
                children.map((child, index) => {
                    return (
                        <Row key={ index } className='border border-info rounded-3 p-3 mb-3'>
                            <Col className='col-md-8'>
                                <h2>{ `${child.fName} ${child.lName}` }</h2>
                            </Col>
                            <Col className='col-md-4 d-flex justify-content-end'>
                                <Button variant='info' onClick={handleUpdateChild}>Update</Button>
                            </Col>
                        </Row>
                    )
                }) 
            }
            <Row>
                <Button className='mt-3 p-3 text-lg' variant='primary' onClick={showAddChildForm}>Add Child</Button>
            </Row>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent
})

export default connect(mapStateToProps)(EditChildList);