// pages/ItemMasterPage.jsx

import {
    useCallback,
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

    const loadData = useCallback(async () => {

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
                Array.isArray(res?.Data)
                    ? res.Data
                    : []
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    }, []);

    useEffect(() => {

        const timeoutId =
            setTimeout(
                loadData,
                0
            );

        return () =>
            clearTimeout(timeoutId);

    }, [loadData]);

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
