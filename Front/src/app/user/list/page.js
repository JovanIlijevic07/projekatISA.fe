'use client';
import useListData from "@/hooks/useListData";
import DataTable from "react-data-table-component";
import {useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Row, Spinner} from "reactstrap";
import {useTestActions} from "@/contexts/testContext";
import {CiEdit, CiTrash} from "react-icons/ci";
import {useListActions} from "@/contexts/listActionContext";
import listAction from "@/core/listAction";
import AllUserDialogs from "@/elements/User/AllUserDialogs";
import {IoAddCircleOutline} from "react-icons/io5";
import {signIn, useSession} from "next-auth/react";
import useAuth from "@/hooks/useAuth";
import storageKey from "@/core/storageKey";

export const tableColumns = [
    {
        name: 'Username',
        selector: (row) => `${row.username}`,
        sortable: false
    },
    {
        name: 'Email',
        selector: (row) => `${row.email}`,
        sortable: false
    },

]

export default function UserList() {
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {state, dispatch} = useListActions();

    const {
        getData,
        loading,
        data
    } = useListData(`user/get-user-list?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`);

    useEffect(() => {
        getData(`user/get-user-list?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`);
    }, [pageSize, pageNumber]);

    useEffect(() => {
        if (state.reload) {
            getData(`user/get-user-list?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`);
        }
    }, [state]);

    const handlePageChange = async (page) => {
        setPageNumber(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPageNumber(page);
        setPageSize(newPerPage);
    };

    return (
        <>
            <Card>
                <CardHeader className="d-flex justify-content-end">
                    <Button className="btn btn-success me-3" variant="outline-light" onClick={() => {
                        dispatch({
                            type: listAction.CREATE
                        })
                    }}>
                        Create User <IoAddCircleOutline/>
                    </Button>
                </CardHeader>
                <CardBody>
                    {data != null && <DataTable data={data.user}
                                                columns={tableColumns}
                                                striped={true}
                                                noHeader={true}
                                                pagination
                                                paginationServer
                                                progressPending={loading}
                                                paginationTotalRows={data.user}
                                                onChangePage={handlePageChange}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                progressComponent={<Spinner color="danger">Ocitavanje...</Spinner>}
                                                highlightOnHover
                    />}
                </CardBody>
            </Card>

            <AllUserDialogs/>
        </>
    );
}
