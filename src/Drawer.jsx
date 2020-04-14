import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CasesDrawer = ({ filteredData, setDataFilter, dataFilter }) => {

    return (
        <Drawer variant="permanent" anchor="left">
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Countries</TableCell>
                            <TableCell align="right">{dataFilter}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredData.map((filterDatum) => {
                        return (
                            <TableRow key={filterDatum.id}>
                                <TableCell component="th" scope="row">
                                    {filterDatum.country}
                                </TableCell>
                            <TableCell align="right">{filterDatum[dataFilter]}</TableCell>
                        </TableRow>
                        )
                    })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Drawer>
    )
}

export default CasesDrawer; 