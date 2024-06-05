import React from 'react';
import { connect } from '../../lib/my-react-redux';
import { increment, decrement, reset } from '../../store/couterReducer/actions';
import SubCounter from '../SubCounter';

function Counter(props) {
    const {
        count,
        incrementHandler,
        decrementHandler,
        resetHandler
    } = props;
    return (
        <>
            <h1>Count: {count}</h1>
            <button onClick={incrementHandler}>计数+1</button>&nbsp;&nbsp;
            <button onClick={decrementHandler}>计数-1</button>&nbsp;&nbsp;
            <button onClick={resetHandler}>重置</button>
            <SubCounter></SubCounter>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        count: state.count
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        incrementHandler: () => dispatch(increment()),
        decrementHandler: () => dispatch(decrement()),
        resetHandler: () => dispatch(reset()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)