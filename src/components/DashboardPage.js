import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getDocs, query, collection } from 'firebase/firestore';
import { AreaChart, Area, Tooltip, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { connect } from 'react-redux';
import Nav from './Nav';

import AddChildAlert from './AddChildAlert';
import AddLogAlert from './AddLogAlert';
import DashboardFilters from './DashboardFilters';
import db from '../firebase/firebase';
import moment from 'moment';

const Dashboard = (props) => {
    useEffect(async () => {
        if(props.currentParent.children) {
            setShowAddChildAlert(props.currentParent.children.length === 0);
            const tempChildData = [{fName: ``, lName: ``}];
            const q = query(collection(db, `parents/${props.currentParent.refId}/children`));
            const children = await getDocs(q);

            children.forEach(child => tempChildData.push({
                refId: child.id,
                ...child.data(),
            }));

            setChildData(tempChildData);

            const tempLogs = [];
            for (const child of tempChildData) {
                const logs = await getDocs(collection(db, `parents/${props.currentParent.refId}/children/${child.refId}/logs`));
                logs.forEach(log => tempLogs.push({
                    ...log.data(),
                    childRefId: child.refId,
                    logRefId: log.id,
                }));
                tempLogs.length === 0 ? setShowAddLogAlert(true) : setShowAddLogAlert(false);

                const tempGraphData = [];
                if(tempLogs.length !== 0) {
                    tempLogs.forEach(log => {
                        log.logDays.forEach(logDay => {
                            tempGraphData.push({
                                ...logDay,
                                formattedDate: moment(logDay.date).format('MMM Do YYYY'),
                            })
                        })
                    });
                }
    
                tempGraphData.sort((first, second) => first.date - second.date);
                setGraphData(tempGraphData);
            }

            setLogData(tempLogs);
        }
    }, [props.currentParent.children, graphData]);

    const [showAddChildAlert, setShowAddChildAlert] = useState(false);
    const [showAddLogAlert, setShowAddLogAlert] = useState(false);
    const [childData, setChildData] = useState([]);
    const [logData, setLogData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [totalLogMinutes, setTotalLogMinutes] = useState(0);

    return (
        <div>
            <Nav {...props}></Nav>
            <Container>
                {
                    !showAddChildAlert && !showAddLogAlert && logData.length !== 0 &&
                    <Container>
                        <DashboardFilters 
                            childData={childData}
                            logData={logData}
                            setGraphData={setGraphData}
                            setTotalLogMinutes={setTotalLogMinutes}
                        ></DashboardFilters>
                        <Row>
                            <Col md={6} xs={12}>
                                <div 
                                    className='mb-3 p-3 text-center'
                                    style={{
                                        height: "10vh",
                                        backgroundColor: "#FFA384",
                                        color: "#E7F2F8",
                                    }}>
                                    <h3>Hours</h3>
                                    <p>{Math.floor(totalLogMinutes / 60)}</p>
                                </div>
                            </Col>
                            <Col md={6} xs={12}>
                                <div 
                                    className='mb-3 p-3 text-center'
                                    style={{
                                        height: "10vh",
                                        backgroundColor: "#FFA384",
                                        color: "#E7F2F8",
                                    }}>
                                    <h3>Minutes</h3>
                                    <p>{totalLogMinutes % 60}</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='col-12'>
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={graphData}>
                                        <Area type='monotone' dataKey='minutes' stroke='#FFA384' fill='#FFA384'/>
                                        <CartesianGrid stroke='#ccc'/>
                                        <XAxis dataKey='formattedDate' />
                                        <YAxis />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Col>
                        </Row>
                    </Container>
                }
                {
                    showAddChildAlert &&
                    <AddChildAlert
                    {...props}
                    ></AddChildAlert> 
                }
                {
                    showAddLogAlert && !showAddChildAlert &&
                    <AddLogAlert
                    {...props}
                    ></AddLogAlert> 
                }
            </Container>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentParent: state.parent.currentParent,
})

export default connect(mapStateToProps)(Dashboard);