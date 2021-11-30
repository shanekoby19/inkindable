import React, { useEffect, useState } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { DatePicker } from '@mui/lab';
import { TextField } from '@mui/material';
import { IconContext } from 'react-icons';
import { FcClearFilters } from 'react-icons/fc';
import moment from 'moment';
import { 
    updateDashboardLogTypeFilter, 
    updateDashboardChildNameFilter, 
    updateDashboardStatusFilter,
    updateDashboardStartDateFilter,
    updateDashboardEndDateFilter, } from '../actions/DashboardFilterActions';

const DashboardFilters = (props) => {
    const [defaultStartDate, setDefaultStartDate] = useState(moment(0));
    const [defaultEndDate, setDefaultEndDate] = useState(moment(0));
    const [children, setChildren] = useState([]);
    const [logTypes, setLogTypes] = useState([]);
    const [submissionsStatuses, setSubmissionStatuses] = useState([]);


    useEffect(() => {
        const filteredLogData = (
            props.logData.filter(log => !props.dashboardFilters.currentStatusValue || log.status === props.dashboardFilters.currentStatusValue)
                         .filter(log => !props.dashboardFilters.currentLogTypeValue || log.type === props.dashboardFilters.currentLogTypeValue)
                         .filter(log => props.dashboardFilters.currentChildNameValue === ` ` || log.childName === props.dashboardFilters.currentChildNameValue)
        )
        setLogTypes([``, ...new Set(filteredLogData.map(log => log.type))]);
        setChildren([` `, ...new Set(filteredLogData.map(log => log.childName))]);
        setSubmissionStatuses([``, ...new Set(filteredLogData.map(log => log.status))]);
        const tempLogData = [];
        filteredLogData.forEach(log => tempLogData.push(...log.logDays));
        tempLogData.forEach((_, index) => tempLogData[index] = {
            ...tempLogData[index],
            formattedDate: moment(tempLogData[index].date).format('MMM Do YYYY')
        });

        tempLogData.sort((first, second) => first.date - second.date);
        setDefaultStartDate(moment(tempLogData[0].date));
        setDefaultEndDate(moment(tempLogData[tempLogData.length - 1].date));
   
        if(!props.dashboardFilters.currentStartDateValue.isSame(moment(tempLogData[0].date), 'day')) {
            return props.updateDashboardStartDateFilter(moment(tempLogData[0].date));
        }

        if(!props.dashboardFilters.currentEndDateValue.isSame(moment(tempLogData[tempLogData.length - 1].date), 'day')) {
            return props.updateDashboardEndDateFilter(moment(tempLogData[tempLogData.length - 1].date));
        }

        const finalGraphData = tempLogData.filter(log => log.date >= props.dashboardFilters.currentStartDateValue)
                                          .filter(log => log.date <= props.dashboardFilters.currentEndDateValue);
                                          
        props.setTotalLogMinutes(finalGraphData.reduce((prevValue, current) => prevValue + current.minutes, 0));
        props.setGraphData([...finalGraphData]);
    }, [props.dashboardFilters]);

    const clearFilters = () => {
        props.updateDashboardChildNameFilter(` `);
        props.updateDashboardLogTypeFilter(``);
        props.updateDashboardStatusFilter(``);
    }

    return (
        <div>
            <Row className='mb-5'>
                <IconContext.Provider value={{size: "3rem"}}>
                    <Col className='col-12 d-flex justify-content-end'>
                        <FcClearFilters onClick={() => clearFilters()}></FcClearFilters>
                    </Col>
                </IconContext.Provider>
            </Row>
            <Row className='justify-content-center'>
                <Col lg={4} md={10} sm={12} xs={12}>
                    <label className='mb-3' htmlFor='input'>Child Name</label>
                    <Form.Select 
                        onChange={(e) => { props.updateDashboardChildNameFilter(e.target.value); }} 
                        value={props.dashboardFilters.currentChildNameValue}
                        className='p-2 mb-5'>
                        { 
                            children
                            .sort((first, second) => first > second)
                            .map((child, index) => <option key={index} value={child}>{child}</option>) 
                        }
                    </Form.Select>
                </Col>
                <Col lg={4} md={10} sm={12} xs={12}>
                    <label className='mb-3' htmlFor='input'>Log Type</label>
                    <Form.Select 
                        onChange={(e) => { props.updateDashboardLogTypeFilter(e.target.value); } } 
                        value={props.dashboardFilters.currentLogTypeValue}
                        className='p-2 mb-5'>
                        { 
                            logTypes
                            .sort()
                            .map((logType, index) => <option key={index} value={logType}>{logType}</option>) 
                        }
                    </Form.Select>
                </Col>
                <Col lg={4} md={10} sm={12} xs={12}>
                    <label className='mb-3' htmlFor='input'>Submission Status</label>
                    <Form.Select 
                        onChange={(e) => { props.updateDashboardStatusFilter(e.target.value) } } 
                        value={props.dashboardFilters.currentStatusValue}
                        className='p-2 mb-5'>
                        { 
                            submissionsStatuses
                            .sort()
                            .map((status, index) => <option key={index} value={status}>{status}</option>) 
                        }
                    </Form.Select>
                </Col>
                <Col lg={4} md={10} sm={12} xs={12} className='mb-5 d-flex flex-column'> 
                    <label className='mb-3' className= 'mb-3' htmlFor='input'>Start Date</label>
                    <DatePicker
                        value={props.dashboardFilters.currentStartDateValue}
                        onChange={(newValue => {
                            props.updateDashboardStartDateFilter(moment(newValue));
                        }) }
                        shouldDisableDate={(date) => date > props.dashboardFilters.currentEndDateValue || date < defaultStartDate}
                        renderInput={(params) => <TextField {...params}/>}
                    />
                </Col>
                <Col lg={4} md={10} sm={12} xs={12} className='mb-5 d-flex flex-column'> 
                    <label className='mb-3' className= 'mb-3' htmlFor='input'>End Date</label>
                    <DatePicker
                        value={props.dashboardFilters.currentEndDateValue}
                        onChange={(newValue => {
                            props.updateDashboardEndDateFilter(moment(newValue));
                        }) }
                        shouldDisableDate={(date) => date < props.dashboardFilters.currentStartDateValue || date > defaultEndDate}
                        renderInput={(params) => <TextField {...params}/>}
                        className='mb-5'
                    />
                </Col>
            </Row>
        </div>
    )
    
}

const mapStateToProps = (state) => ({
    dashboardFilters: state.dashboardFilters,
})

const mapDispatchToProps = (dispatch) => ({
    updateDashboardChildNameFilter: (filterValue) => dispatch(updateDashboardChildNameFilter(filterValue)),
    updateDashboardLogTypeFilter: (filterValue) => dispatch(updateDashboardLogTypeFilter(filterValue)),
    updateDashboardStatusFilter: (filterValue) => dispatch(updateDashboardStatusFilter(filterValue)),
    updateDashboardStartDateFilter: (filterValue) => dispatch(updateDashboardStartDateFilter(filterValue)),
    updateDashboardEndDateFilter: (filterValue) => dispatch(updateDashboardEndDateFilter(filterValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardFilters);