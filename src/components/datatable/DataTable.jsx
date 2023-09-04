import {
    DataGrid,
    GridToolbar,
} from "@mui/x-data-grid";
import "./dataTable.scss";
import { Link } from "react-router-dom";

// components Features
// (1) data table to show employee in admin home page


const DataTable = (props) => {
    console.log(props)
    // TEST THE API

    // const queryClient = useQueryClient();
    // // const mutation = useMutation({
    // //   mutationFn: (id: number) => {
    // //     return fetch(`http://localhost:8800/api/${props.slug}/${id}`, {
    // //       method: "delete",
    // //     });
    // //   },
    // //   onSuccess: ()=>{
    // //     queryClient.invalidateQueries([`all${props.slug}`]);
    // //   }
    // // });

    const handleDelete = (id) => {
        //   delete the item
        //   mutation.mutate(id)
    };

    const actionColumn = {
        field: "action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => {
            return (
                <div className="action">
                    <Link to={`/admin/employee/${params.row.uid}`}>
                        <img src="/view.svg" alt="" />
                    </Link>
                    {/* <div className="delete" onClick={() => handleDelete(params.row.id)}>
                        <img src="/delete.svg" alt="" />
                    </div> */}
                </div>
            );
        },
    };

    return (
        <div className="dataTable">
            <DataGrid
                className="dataGrid"
                rows={props.rows}
                columns={[actionColumn,...props.columns]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                    columns: {
                        columnVisibilityModel: {
                            // Hide columns status and traderName, the other columns will remain visible
                            id:false,
                            uid:false,
                            // position:false,
                        },
                    },

                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                pageSizeOptions={[5]}
                // checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
            />
        </div>
    );
};

export default DataTable;