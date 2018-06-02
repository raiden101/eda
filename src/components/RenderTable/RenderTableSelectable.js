import React, { Component } from 'react';
import './RenderTable.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import CheckBox from '@material-ui/core/Checkbox';
class RenderTableSelectable extends Component {
    state = {
        page: 0,
        rows: 5,
        itemsChecked:[]
    }
    changePage = (event, page) => {
        this.setState({
            page
        })
    }
    changeRows = (event) => {
        this.setState({
            rows: event.target.value
        })
    }
    selectAllClick = (e,checked) => {
        if (checked)
            this.setState({
                itemsChecked: this.props.data.map((e) => {
                    return e.fac_id
                })
            })
        else
            this.setState({
                itemsChecked: []
            });
    }
    toggleCheck = (c,id) => {
        let items = this.state.itemsChecked;
        if (!c)
            items.splice(items.indexOf(id), 1);
        else
            items.push(id);
        this.setState({
            itemsChecked:items
        })
    }
    componentWillUpdate(nextprops, nextstate) {
        if (nextprops.data !== this.props.data)
            this.setState({
                itemsChecked: []
            });
    }
    render() {
        return (
            <div className="rendered-table">
                <div className={"table-title" + (this.state.itemsChecked.length > 0 ? " active" : "")}>
                    <div className="table-title-name">
                        {this.state.itemsChecked.length > 0 ? 
                            this.state.itemsChecked.length + "selected" :
                            this.props.title
                        }
                    </div>
                    {this.state.itemsChecked.length > 0 && <div className="selected-action">
                        {this.props.selectedAction(this.state.itemsChecked)}
                    </div>}
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <CheckBox
                                    checked={this.state.itemsChecked.length === this.props.data.length}
                                    indeterminate={this.state.itemsChecked.length > 0 &&
                                        this.state.itemsChecked.length < this.props.data.length}
                                    onChange={this.selectAllClick}
                                />
                            </TableCell>
                            {this.props.heads.map((element, index) => {
                                if (index === 0) return <TableCell key="head0" padding="none" component="th">{element}</TableCell>
                                return (
                                    <TableCell key={"head" + index}>{element}</TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.slice(
                            this.state.page * this.state.rows,
                            this.state.page * this.state.rows + this.state.rows
                        ).map((element, index) => {
                            return <TableRow key={"row-" + index} selected={this.state.itemsChecked.indexOf(element.fac_id) !== -1}>
                                <TableCell padding="checkbox">
                                    <CheckBox
                                        checked={this.state.itemsChecked.indexOf(element.fac_id) !== -1}
                                        onChange={(e, c) => this.toggleCheck(c, element.fac_id)}
                                    />
                                </TableCell>
                                {this.props.translate(element).map((el, i) => {
                                    if (i === 0) return <TableCell key="cell-0" padding="none">{el}</TableCell>
                                    return <TableCell key={"cell-" + i}>
                                        {el}
                                    </TableCell>
                                })}
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={this.props.data.length}
                    rowsPerPage={this.state.rows}
                    page={this.state.page}
                    onChangePage={this.changePage}
                    onChangeRowsPerPage={this.changeRows}
                />
            </div>
        );
    }
}
export default RenderTableSelectable;