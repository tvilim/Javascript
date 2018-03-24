import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Form.css';
import Input from '../components/Input';
import Button from '../components/Button';
import Backdrop from '../components/Backdrop';

import * as actions from '../Redux/actions';


class Form extends Component {
    state = {
        text: '',
        number: '',
    }

    textInput = null;

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps: ', nextProps);
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    submitHandler = (event) => {
        event.preventDefault();

        const data = {
            item: {
                text: this.state.text,
                number: this.state.number,
            }
        };

        this.props.onSaveItem(data);
        this.setState({
            text: '',
            number: '',
        });
    }

    changeHandler = (event) => {
        const newState = {
            ...this.state,
        };

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
        const disabled = (this.state.text === "" || this.state.number === "");
        console.log("render Form", this.props.saving, Date.now());
        return (
            <div>
                <Backdrop show={this.props.saving} />
                <form onSubmit={this.submitHandler}>
                    <div className='FormDiv'>
                        <Input
                            id="text"
                            type="text"
                            label="Text"
                            placeholder="enter text"
                            value={this.state.text}
                            ref={(input) => this.textInput = input}
                            changeHandler={this.changeHandler} />
                        <Input
                            id="number"
                            type="number"
                            label="Number"
                            placeholder="enter number"
                            value={this.state.number}
                            changeHandler={this.changeHandler} />
                        <div className="Spacer" />
                        <div className="ButtonContainer">
                            <Button
                                cssClass="AddButton"
                                title="Add Item"
                                disabled={disabled} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}



const mapStateToProps = state => {
    return {
        saving: state.form.saving,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveItem: (data) => dispatch(actions.saveItemAsync(dispatch, data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);