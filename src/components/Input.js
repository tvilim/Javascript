import React from 'react';
import './Input.css';


const input = (props) => {
    return (
        <div className='input'>
            <label 
                htmlFor={props.id}
                className='item label'>{props.label + ":"}</label>
            <input 
                id={props.id}
                type={props.type}
                className='item control'
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.changeHandler} />
        </div>
    );
}


export default input;
