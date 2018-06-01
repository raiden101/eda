import React, { Component } from 'react';
import './RenderTable.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
class RenderTable extends Component{
    state = {
        page: 0,
        rows:5
    }
    changePage = (event, page) => {
        this.setState({
            page
        })
    }
    changeRows = (event) => {
        this.setState({
            rows:event.target.value
        })
    }
    render() {
        return (
            <div className="rendered-table">
                <Table>
                    <TableHead>
                        <TableRow>
                            {this.props.heads.map((element,index) => {
                                return (
                                    <TableCell key={"head" + index}>{element}</TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.data.slice(
                            this.state.page * this.state.rows,
                            this.state.page * this.state.rows+this.state.rows
                        ).map((element, index) => {
                            return <TableRow key={"row-"+index}>
                                {this.props.translate(element).map((el,i) => {
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
export default RenderTable;