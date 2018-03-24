import React from 'react';
import './Input.css';


class Input extends React.Component {
    focus = () => {
        if (this.inputControl) this.inputControl.focus();
    }

    render() {
        return (
            <div className='Input'>
                <label 
                    htmlFor={this.props.id}
                    className='Item Label'>{this.props.label + ":"}</label>
                <input 
                    id={this.props.id}
                    type={this.props.type}
                    className='Item Control'
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    ref={(control) => this.inputControl = control}
                    onChange={this.props.changeHandler} />
            </div>
        );
    }
}


export default Input;
