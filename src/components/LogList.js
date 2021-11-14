import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { getDocs, query, collection } from 'firebase/firestore';

import db from '../firebase/firebase';
import LogListHeader from './LogListHeader';

const LogList = (props) => {
    const [childData, setChildData] = useState([]);
    const [logData, setLogData] = useState([]);
    const [selectedChild, setSelectedChild] = useState(``);

    useEffect(async () => {
        const tempChildData = [{fName: ``, lName: ``}];
        const q = query(collection(db, `parents/${props.currentParent.refId}/children`));
        const children = await getDocs(q);

        children.forEach(child => tempChildData.push({
            refId: child.id,
            ...child.data(),
        }));

        setChildData(tempChildData);

        tempChildData.forEach(async (child) => {
            const tempLogs = [];
            const logs = await getDocs(collection(db, `parents/${props.currentParent.refId}/children/${child.refId}/logs`));
            logs.forEach(log => tempLogs.push({
                ...log.data(),
                childRefId: child.refId,
                logRefId: log.id,
            }));
            setLogData(tempLogs);
        });
    }, []);

    const handleAddLog = () => {
        props.setShowLogList(false);
        props.setShowAddLogForm(true);
    }

    return (
        <Container>
                <Row className='border-bottom border-3 mb-5'>
                    <h2 className='text-center display-4'>Logs</h2>
                </Row>
                <LogListHeader {...props} logData={logData}></LogListHeader>
                <Row>
                    <Col>
                        <ButtonGroup className='d-flex'>
                            <Button 
                                className='p-3' 
                                variant='success'
                                onClick={handleAddLog}
                                >Add Log</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
        </Container>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect(mapStateToProps)(LogList);