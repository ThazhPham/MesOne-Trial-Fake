// pages/ItemMaster.jsx

import {
    useCallback,
    useEffect,
    useState
} from "react";

import DataGrid, {
    Column,
    Paging,
    Pager,
    SearchPanel
} from "devextreme-react/data-grid";

import apiServer from "../api/apiServer";

export default function ItemMasterPage() {

    // =========================
    // STATE
    // =========================

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [pageIndex, setPageIndex] =
        useState(1);

    const [pageSize] =
        useState(20);

    const [totalRows, setTotalRows] =
        useState(0);

    // =========================
    // LOAD DATA
    // =========================

    const loadData = useCallback(async () => {

        try {

            setLoading(true);

            const res =
                await apiServer.getItemMaster(
                    pageIndex,
                    pageSize
                );

            console.log(
                "ITEM MASTER:",
                res
            );

            const list =
                Array.isArray(res?.Data)
                    ? res.Data
                    : [];

            setData(list);
            setTotalRows(
                list[0]?.totalRows ||
                res?.TotalRows ||
                list.length
            );

        } catch (err) {

            console.log(err);
            setData([]);
            setTotalRows(0);

        } finally {

            setLoading(false);
        }
    }, [pageIndex, pageSize]);

    // =========================
    // EFFECT
    // =========================

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
    // PAGING
    // =========================

    const onOptionChanged = (e) => {

        if (
            e.fullName ===
            "paging.pageIndex"
        ) {

            setPageIndex(
                e.value + 1
            );
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
                remoteOperations={true}
                hoverStateEnabled={true}
                focusedRowEnabled={true}
                keyExpr="ItemCode"
                onOptionChanged={
                    onOptionChanged
                }
                loading={loading}
            >

                <SearchPanel
                    visible={true}
                />

                <Paging
                    pageSize={pageSize}
                />

                <Pager
                    visible={true}
                    showInfo={true}
                    showPageSizeSelector={false}
                    infoText={
                        "Page {0} of {1} ({2} items)"
                    }
                />

                {/* COLUMN */}

                <Column
                    dataField="ItemCode"
                    caption="Item Code"
                />

                <Column
                    dataField="ItemName"
                    caption="Item Name"
                />

                <Column
                    caption="Item Group"
                    calculateCellValue={(row) =>
                        row.ItemsGroupCode || ""
                    }
                />

                <Column
                    caption="UOM"
                    calculateCellValue={(row) =>
                        row.InventoryUOM || ""
                    }
                />

                <Column
                    caption="Warehouse"
                    calculateCellValue={(row) =>
                        row.DefaultWarehouse || ""
                    }
                />

                <Column
                    dataField="OnHand"
                    caption="On Hand"
                    calculateCellValue={(row) =>
                        Number(row.OnHand || 0)
                    }
                />

                <Column
                    dataField="Currency"
                    caption="Currency"
                />

            </DataGrid>

            <div style={{ marginTop: 10 }}>
                Total Rows: {totalRows}
            </div>

        </div>
    );
}
