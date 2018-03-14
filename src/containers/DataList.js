import React, { Component } from 'react';
import { connect } from 'react-redux';

import './DataList.css';
import * as actions from '../Redux/actions';


class DataList extends Component {
    componentDidMount() {
        this.props.onLoadListAsync();
    }

    render() {
        let list = null;
        if (this.props.loading) {
            list = <p>Loading...</p>
        } else if (this.props.error) {
            list = <p>ERROR: {this.props.error.message}</p>
        } else {
            if (this.props.list) {
                list = this.props.list.map((item, index) => {
                    return (
                        <li
                            className="ListItem"
                            key={item.id}>{"Text: "}<b>{item.item.text}</b>, Item: <b>{item.item.number}</b></li>
                    );
                });
            }
        }
        return (
            <div>
                <ul className="List">
                    {list}
                </ul>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        list: state.list.list,
        loading: state.list.loading,
        error: state.list.error,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoadListAsync: () => dispatch(actions.loadListAsync()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DataList);