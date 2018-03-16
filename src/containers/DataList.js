import React, { Component } from 'react';
import { connect } from 'react-redux';

import './DataList.css';
import * as actions from '../Redux/actions';


class DataList extends Component {
    state = {
        selectedItems: new Set(),
        lastClicked: null,
        current: 0,
        focused: false,
    }

    componentDidMount() {
        this.props.onLoadListAsync();
    }

    itemClickHandler = (event, id) => {
        console.log('itemClicked', event, id);

        let newState = { ...this.state };
        const current = this.getIndexFromId(id);

        if (event.shiftKey) {
            if (!event.ctrlKey) {
                newState.selectedItems = new Set();
            }
            this.addRangeToSelection(newState.selectedItems, this.getIndexFromId(newState.lastClicked), current);
        } else if (event.ctrlKey) {
            if (newState.selectedItems.has(id)) {
                newState.selectedItems.delete(id);
            }
            else {
                newState.selectedItems.add(id);
            }
        } else if (!event.altKey) {
            newState.selectedItems = new Set([id]);
        }

        newState.lastClicked = id;
        newState.current = this.getIndexFromId(id);

        this.setState(newState);
        event.preventDefault();
    }

    itemKeyDownHandler = (event, id) => {
        console.log("Key", event.key);

        const lastIndex = this.props.list.length - 1;
        let newState = { ...this.state };
        let newId = null;

        switch (event.key) {
            case 'a':
                if (event.ctrlKey) {
                    newState.selectedItems = new Set();
                    this.addRangeToSelection(newState.selectedItems, 0, lastIndex);
                }
                event.preventDefault();
                break;

            case " ":
                if (newState.selectedItems.has(id)) {
                    if (event.ctrlKey) {
                        newState.selectedItems.delete(id);
                    }
                } else {
                    newState.selectedItems.add(id);
                }
                break;

            case "ArrowUp":
                if (newState.current > 0) {
                    newState.current--;
                    newId = this.getIdFromIndex(newState.current);

                    this.handleKeyboardSelection(event, newState, newId);
                    event.preventDefault();
                }
                break;

            case "ArrowDown":
                if (newState.current < lastIndex) {
                    newState.current++;
                    newId = this.getIdFromIndex(newState.current);

                    this.handleKeyboardSelection(event, newState, newId);
                    event.preventDefault();
                }
                break;

            case "PageUp":
                break;

            case "PageDown":
                break;

            case "Home":
                if (newState.current > 0) {
                    newState.current = 0;
                    newId = this.getIdFromIndex(newState.current);

                    this.handleKeyboardSelection(event, newState, newId);
                    event.preventDefault();
                }
                break;

            case "End":
                if (newState.current < lastIndex) {
                    newState.current = lastIndex;
                    newId = this.getIdFromIndex(newState.current);

                    this.handleKeyboardSelection(event, newState, newId);
                    event.preventDefault();
                }
                break;

            default:
                break;
        }

        console.log('LastClicked:', this.getIndexFromId(newState.lastClicked));
        this.setState(newState);
    }

    handleKeyboardSelection(event, newState, newId) {
        if (event.shiftKey) {
            if (!event.ctrlKey) {
                newState.selectedItems = new Set();
            }
            this.addRangeToSelection(newState.selectedItems, this.getIndexFromId(this.state.lastClicked), newState.current);
        } else if (!event.ctrlKey) {
            newState.selectedItems = new Set([newId]);
        }

        if (!event.ctrlKey && !event.shiftKey) {
            newState.lastClicked = newId;
        }
    }

    addRangeToSelection(selectedItems, start, end = start) {
        if (start > end) {
            const n = start;
            start = end;
            end = n;
        }

        for (let i = start; i <= end; i++) {
            selectedItems.add(this.getIdFromIndex(i));
        }
    }

    getIndexFromId(id) {
        return this.props.list.reduce((accumulator, item, index) => {
            return (item.id === id) ? index : accumulator;
        }, 0);
    }

    getIdFromIndex(index) {
        const item = this.props.list[index];
        return item ? item.id : null;
    }

    focusHandler = () => {
        let newState = { ...this.state };
        newState.focused = true;
        this.setState(newState);
    }

    blurHandler = () => {
        let newState = { ...this.state };
        newState.focused = false;
        this.setState(newState);
    }

    componentDidUpdate() {
        if (this.state.focused) {
            const el = document.getElementById(this.getIdFromIndex(this.state.current));
            if (el) el.focus();
        }
    }


    scrollHandler(event) {
        console.log("ScrollHandler", event.target);
    }

    render() {
        let list = null;
        if (this.props.loading) {
            list = <p>Loading...</p>;
        } else if (this.props.error) {
            list = <p>ERROR: {this.props.error.message}</p>;
        } else {
            if (this.props.list) {
                list = this.props.list.map((item, index) => {
                    const isSelected = this.state.selectedItems && this.state.selectedItems.has(item.id);
                    const itemClasses = ["ListItem"];
                    if (isSelected) itemClasses.push("SelectedItem");

                    return (
                        <div
                            id={item.id}
                            tabIndex={index === this.state.current ? 0 : -1}
                            className={itemClasses.join(' ')}
                            key={item.id}
                            onClick={event => this.itemClickHandler(event, item.id)}
                            onKeyDown={event => this.itemKeyDownHandler(event, item.id)}
                            onFocus={event => this.focusHandler(event)}
                            onBlur={event => this.blurHandler(event)}
                        >{"Text: "}<b>{item.item.text}</b>, Item: <b>{item.item.number}</b></div>
                    );
                });
            }
        }
        return (
            <div className="ListContainer">
                <div 
                    className="List"
                    onScroll={event => this.scrollHandler(event)}>
                    {list}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        list: state.list.list,
        loading: state.list.loading,
        error: state.list.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadListAsync: () => dispatch(actions.loadListAsync()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(DataList);