import React from 'react';

import './Button.css';


const button = (props) => {
    const classes = ["Button"];
    if (props.cssClass) classes.push(props.cssClass);
    return (
        <button
            className={classes.join(" ")}
            onClick={props.onClick}
            disabled={props.disabled}>{props.title}</button>
    );
};


export default button;