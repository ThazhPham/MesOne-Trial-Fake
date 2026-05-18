// pages/ItemMasterPage.jsx

import {
    useEffect,
    useState
} from "react";

import DataGrid, {
    Column,
    Paging,
    SearchPanel
} from "devextreme-react/data-grid";

import apiServer from "../api/apiServer";

export default function ItemMasterPage() {

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const res =
                await apiServer.getItemMaster();

            console.log(
                "ITEM MASTER:",
                res
            );

            // DATA API
            setData(
                res.Data || []
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // UI
    // =========================

    return (

        <div className="app-content">

            <h2>
                Item Master
            </h2>

            <DataGrid
                dataSource={data}
                showBorders={true}
                hoverStateEnabled={true}
                focusedRowEnabled={true}
                keyExpr="ItemCode"
                loading={loading}
            >

                <SearchPanel
                    visible={true}
                />

                <Paging
                    defaultPageSize={20}
                />

                <Column
                    dataField="ItemCode"
                    caption="Item Code"
                />

                <Column
                    dataField="ItemName"
                    caption="Item Name"
                />

                <Column
                    dataField="ItemsGroupCode"
                    caption="Group"
                />

            </DataGrid>

        </div>
    );
}