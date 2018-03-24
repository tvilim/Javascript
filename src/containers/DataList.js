import React, { Component } from 'react';
import { connect } from 'react-redux';

import './DataList.css';
import * as actions from '../Redux/actions';
import * as Utilities from '../Utilities/Utilities';

import Button from '../components/Button';
import Backdrop from '../components/Backdrop';


class DataList extends Component {
    state = {
        selectedItems: new Set(),
        lastClicked: null,
        current: 0,
        focused: false,
        idToSelect: null,
    }

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps: ', nextProps);

        if (nextProps.idToSelect) {
            //make sure newly added item is selected
            const id = nextProps.idToSelect;

            const newState = {
                selectedItems: new Set([id]),
                lastClicked: id,
                current: this.getIndexFromId(id, nextProps.list),
                focused: false,
                idToSelect: id,
            };
            this.setStateEx(newState, "componentWillReceiveProps");
        } else if (nextProps.list && nextProps.list.length > 0) {
            const id = nextProps.list[0].id;
            const newState = {
                selectedItems: new Set([id]),
                lastClicked: id,
                current: 0,
                focused: false,
                idToSelect: null,
            };
            this.setStateEx(newState, "componentWillReceiveProps");
        }
    }

    componentDidMount() {
        this.props.onLoadListAsync();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props === nextProps) {
            //console.log("next", nextState);
            //console.log("curr", this.state);

            if (nextState.lastClicked === this.state.lastClicked
                && nextState.current === this.state.current
                && nextState.focused === this.state.focused
                && Utilities.setsEqual(nextState.selectedItems, this.state.selectedItems)
                && nextState.idToSelect === this.state.idToSelect) {
                return false;   //nothing relevant changed
            }
        }

        return true;
    }

    componentDidUpdate() {
        if (this.state.focused) {
            const el = document.getElementById(this.getIdFromIndex(this.state.current));
            if (el) el.focus();
        }

        if (this.state.idToSelect) {
            const element = document.getElementById(this.state.idToSelect);
            element.scrollIntoView();
            this.setState({ idToSelect: null });
        }
    }

    itemClickHandler = (event) => {
        const target = this.getValidTarget(event);
        if (target === null) return;

        const id = target.id;
        const current = this.getIndexFromId(id);

        let newState = Utilities.cloneObject(this.state);

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
        newState.focused = true;

        this.setStateEx(newState, "itemClickHandler");
        //  ('LastClicked(mouse):', this.getIndexFromId(newState.lastClicked), newState.lastClicked);

        event.preventDefault();
    }

    setStateEx = (state, caller) => {
        //console.log("setStateEx, caller:", caller);
        this.setState(state);
    }

    itemKeyDownHandler = (event) => {
        const target = this.getValidTarget(event);
        if (target === null) return;

        const id = event.target.id;

        const lastIndex = this.props.list.length - 1;
        let newState = Utilities.cloneObject(this.state);
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
                //TODO
                break;

            case "PageDown":
                //TODO
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
                return; //unhandled key
        }

        //console.log('LastClicked:', this.getIndexFromId(newState.lastClicked));
        this.setStateEx(newState, "itemKeyDownHandler");
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

    getIndexFromId(id, list = this.props.list) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === id) return i;
        }
        return -1;
    }

    getIdFromIndex(index, list = this.props.list) {
        if (!list || list.length === 0) return null;

        const item = list[index];
        return item ? item.id : null;
    }

    focusHandler = (event) => {
        const target = this.getValidTarget(event);
        if (target === null) return;

        let newState = Utilities.cloneObject(this.state);
        newState.focused = true;
        this.setStateEx(newState, "focusHandler");
    }

    blurHandler = (event) => {
        const target = this.getValidTarget(event);
        if (target === null) return;

        let newState = Utilities.cloneObject(this.state);
        newState.focused = false;
        this.setStateEx(newState, "blurHandler");
    }

    getValidTarget = (event) => {
        let target = event.target;

        if (target.className === "List") {
            return null;
        }

        while (target.id === "") {
            target = target.parentNode;
        }

        const classNames = target.className.split(" ");
        return (classNames.indexOf("ListItem") >= 0) ? target : null;
    }

    deleteItems = () => {
        const ids = [...this.state.selectedItems];
        this.props.onDeleteItemsAsync(ids);
    }

    render() {
        console.log('render DataList: ', this.props.loading, Date.now());
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
                    if (this.state.focused) itemClasses.push("ListFocused");
                    if (isSelected) itemClasses.push("SelectedItem");

                    return (
                        <div
                            id={item.id}
                            tabIndex={index === this.state.current ? 0 : -1}
                            className={itemClasses.join(' ')}
                            key={item.id}
                        >Text: <b>{item.item.text}</b>, Number: <b>{item.item.number}</b></div>
                    );
                });
            }
        }

        const selectedCount = this.state.selectedItems.size;
        const deleteDisabled = (selectedCount === 0);

        return (
            <div className="ListContainer">
                <Backdrop show={this.props.loading} />
                <div
                    className="List"
                    onFocus={event => this.focusHandler(event)}
                    onBlur={event => this.blurHandler(event)}
                    onMouseDown={event => this.itemClickHandler(event)}
                    onKeyDown={event => this.itemKeyDownHandler(event)}>
                    {list}
                </div>
                <Button
                    cssClass="DeleteButton"
                    title={`Delete ${selectedCount} item${selectedCount === 1 ? "" : "s"}`}
                    onClick={this.deleteItems}
                    disabled={deleteDisabled} />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    //console.log("mapStateToProps: ", state.list.idToSelect);
    return {
        list: state.list.list,
        loading: state.list.loading,
        error: state.list.error,
        idToSelect: state.list.idToSelect,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadListAsync: () => dispatch(actions.loadListAsync()),
        onDeleteItemsAsync: (ids) => dispatch(actions.deleteItemsAsync(ids)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(DataList);