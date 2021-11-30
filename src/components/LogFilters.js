import React, { useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateChildNameFilter, updateLogTypeFilter, updateStatusFilter } from '../actions/LogFilterActions';


const LogFilters = (props) => {
    useEffect(() => {
        if(props.logData.length !== 0) {
            props.setDisplayLogData(
                props.logData
                .filter(log => !props.logFilters.currentLogTypeValue || log.type === props.logFilters.currentLogTypeValue)
                .filter(log => props.logFilters.currentChildNameValue === ' ' || log.childName === props.logFilters.currentChildNameValue)
                .filter(log => !props.logFilters.currentStatusValue || log.status === props.logFilters.currentStatusValue)
            )
        }
    }, [props.reload, props.logData, props.logFilters]);

    return (
        <Row>
            <Col lg={4} md={6} sm={12} xs={12}>
                <label className='mb-3' htmlFor='input'>Child Name</label>
                <Form.Select 
                    onChange={(e) => { props.updateChildNameFilter(e.target.value); props.setReload(!props.reload); }} 
                    value={props.logFilters.currentChildNameValue}
                    id='log-select' 
                    className='p-2 mb-5'>
                    { 
                        props.childData
                        .sort((first, second) => first.fName > second.fName)
                        .map((child, index) => <option key={index} value={`${child.fName} ${child.lName}`}>{`${child.fName} ${child.lName}`}</option>) 
                    }
                </Form.Select>
            </Col>
            <Col lg={4} md={6} sm={12} xs={12}>
                <label className='mb-3' htmlFor='input'>Log Type</label>
                <Form.Select 
                    onChange={(e) => { props.updateLogTypeFilter(e.target.value); props.setReload(!props.reload); } } 
                    value={props.logFilters.currentLogTypeValue}
                    id='log-select' 
                    className='p-2 mb-5'>
                    { 
                        [``, `Volunteer Hours`, `Reading At Home`, `Peer Cards`]
                        .sort()
                        .map((logType, index) => <option key={index} value={logType}>{logType}</option>) 
                    }
                </Form.Select>
            </Col>
            <Col lg={4} md={6} sm={12} xs={12}>
                <label className='mb-3' htmlFor='input'>Submission Status</label>
                <Form.Select 
                    onChange={(e) => { props.updateStatusFilter(e.target.value); props.setReload(!props.reload); } } 
                    value={props.logFilters.currentStatusValue}
                    id='log-select' 
                    className='p-2 mb-5'>
                    { 
                        [``, `Pending`, `Submitted`]
                        .sort()
                        .map((status, index) => <option key={index} value={status}>{status}</option>) 
                    }
                </Form.Select>
            </Col>
        </Row>
    )
    
}

const mapStateToProps = (state) => ({
    logFilters: state.logFilters,
})

const mapDispatchToProps = (dispatch) => ({
    updateChildNameFilter: (filterValue) => dispatch(updateChildNameFilter(filterValue)),
    updateLogTypeFilter: (filterValue) => dispatch(updateLogTypeFilter(filterValue)),
    updateStatusFilter: (filterValue) => dispatch(updateStatusFilter(filterValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogFilters);