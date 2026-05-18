import {
    useEffect,
    useState,
    useCallback
} from "react";

import DataGrid, {
    Column,
    Paging,
    Pager,
    SearchPanel
} from "devextreme-react/data-grid";

import "../css/BomMaster.css";
import apiServer from "../api/apiServer";

export default function BomMasterPage() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(20);
    const [totalRows, setTotalRows] = useState(0);

    // =========================
    // LOAD DATA (FIXED)
    // =========================
    const loadData = useCallback(async () => {

        try {
            setLoading(true);

            const res = await apiServer.getBomMaster(
                pageIndex,
                pageSize
            );

            console.log("BOM API:", res);

            // =========================
            // SAFE DATA PARSE
            // =========================
            const rawList =
                res?.Data?.Data ||
                res?.Data ||
                [];

            const list = Array.isArray(rawList)
                ? rawList
                : [];

            // =========================
            // NORMALIZE DATA (IMPORTANT FIX)
            // =========================
            const mapped = list.map((x, i) => ({
                // giữ nguyên data gốc
                ...x,

                // FIX KEY CHO DEVEXTREME
                __id:
                    x.BOMDetailId ||
                    x.BOMId ||
                    x.ComponentItem ||
                    `row_${i}`,

                // SAFE FIELDS (TRÁNH NULL LÀM GRID LỖI UI)
                ComponentItem: x.ComponentItem || "-",
                ComponentItemNm: x.ComponentItemNm || "-",
                BOMId: x.BOMId ?? "-",
                BOMVersion: x.BOMVersion ?? "-",
                Quantity: x.Quantity ?? 0,
                InventoryUOMNm: x.InventoryUOMNm || "-",
                DefaultWarehouse: x.DefaultWarehouse || "-",
                ItemsGroupName: x.ItemsGroupName || "-",
                CreateBy: x.CreateBy || "-",
                CreateDate: x.CreateDate || "-"
            }));

            setData(mapped);

            // TOTAL ROWS
            if (mapped.length > 0) {
                setTotalRows(
                    mapped[0]?.totalRows ||
                    res?.TotalRows ||
                    0
                );
            } else {
                setTotalRows(0);
            }

        } catch (err) {
            console.log("BOM ERROR:", err);
        } finally {
            setLoading(false);
        }

    }, [pageIndex, pageSize]);

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
        if (e.fullName === "paging.pageIndex") {
            setPageIndex(e.value + 1);
        }
    };

    // =========================
    // UI
    // =========================
    return (
        <div className="app-content">

            <h2>BOM Master</h2>

            <DataGrid
                dataSource={data}
                keyExpr="__id"
                showBorders={false}
                columnAutoWidth={true}
                wordWrapEnabled={false}
                rowAlternationEnabled={true}
                hoverStateEnabled={true}
                onOptionChanged={onOptionChanged}
                loading={loading}
            >

                <SearchPanel visible={true} />

                <Paging pageSize={pageSize} />

                <Pager
                    visible={true}
                    showInfo={true}
                    showPageSizeSelector={false}
                    infoText="Page {0} of {1} ({2} items)"
                />

                {/* =========================
                    COLUMNS (SAFE + CLEAN)
                ========================= */}

                <Column dataField="ComponentItem" caption="Component Code" />
                <Column dataField="ComponentItemNm" caption="Component Name" />

                <Column dataField="BOMId" caption="BOM ID" />
                <Column dataField="BOMVersion" caption="Version" />

                <Column dataField="Quantity" caption="Qty" dataType="number" />
                <Column dataField="InventoryUOMNm" caption="UOM" />

                <Column dataField="ItemsGroupName" caption="Group" />
                <Column dataField="DefaultWarehouse" caption="Warehouse" />

                <Column dataField="CreateBy" caption="Created By" />
                <Column dataField="CreateDate" caption="Created Date" />

            </DataGrid>

            <div style={{ marginTop: 10 }}>
                Total Rows: {totalRows}
            </div>

        </div>
    );
}
