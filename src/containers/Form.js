import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Form.css';
import Input from '../components/Input';

import * as actions from '../Redux/actions';


class Form extends Component {
    state = {
        text: '',
        number: '',
    }


    submitHandler = (event) => {
        event.preventDefault();

        const data = {
            item: {
                text: this.state.text,
                number: this.state.number,
            }
        }

        this.props.onSaveItem(data);
        this.setState({
            text: '',
            number: '',
        })
    }

    changeHandler = (event) => {
        const newState = {
            ...this.state,
        }

        switch (event.target.id) {
            case 'text':
                newState['text'] = event.target.value;
                break;

            case 'number':
                newState['number'] = event.target.value;
                break;

            default:
                break;
        }

        this.setState(newState);
    }

    render() {
        return (
            <form onSubmit={this.submitHandler}>
                <div className='FormDiv'>
                    <Input
                        id="text"
                        type="text"
                        label="Text"
                        placeholder="enter text"
                        value={this.state.text}
                        changeHandler={this.changeHandler} />
                    <Input
                        id="number"
                        type="number"
                        label="Number"
                        placeholder="enter number"
                        value={this.state.number}
                        changeHandler={this.changeHandler} />
                </div>
                <button>Send</button>
            </form>
        );
    }
}



const mapStateToProps = state => {
    return {

    };
}

const mapDispatchToProps = dispatch => {
    return {
        onSaveItem: (data) => dispatch(actions.saveItemAsync(dispatch, data)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);