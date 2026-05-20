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

import apiServer from "../api/apiServer";

import "../css/BomMaster.css";
import { Popup } from "devextreme-react/popup";
export default function BomMasterPage() {

    // =====================================
    // GRID
    // =====================================

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [totalRows, setTotalRows] =
        useState(0);

    // =====================================
    // PAGING
    // =====================================

    const [pageIndex, setPageIndex] =
        useState(1);

    const [pageSize] =
        useState(20);

    // =====================================
    // FORM
    // =====================================

    const defaultForm = {

    ParentItem: "",
    ParentItemNm: "",

    ComponentItem: "",
    ComponentItemNm: "",

    Quantity: 1,

    BOMVersion: 0,

    InventoryUOM: "",
    InventoryUOMNm: "",

    ItemsGroupCode: "",
    ItemsGroupName: "",

    U_ItemClas: "",

    EONO: "",

    Remark: "",

    Status: "D",

    IsDefaultBOM: "1",

    UseYN: "1"
};

    const [formData, setFormData] =
        useState(defaultForm);

    const [openPopup, setOpenPopup] = useState(false);

    // =====================================
    // HANDLE CHANGE
    // =====================================

    const handleChange = (e) => {

        const { name, value } =
            e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const [query, setQuery] = useState(defaultForm);

    // HANDLE SEARCH


    // =====================================
    // BUILD FILTER
    // =====================================


    const buildFiltering = () => {

        const filters = [];

        // TREE CODE
        if (formData.ComponentItem) {

            filters.push({
                columName:
                    "ComponentItem",

                valueDefault:
                    formData.ComponentItem,

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        // TREE NAME
        if (formData.ComponentItemNm) {

            filters.push({
                columName:
                    "ComponentItemNm",

                valueDefault:
                    formData.ComponentItemNm,

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        // ITEM CODE NODE
        if (formData.itemCodeM) {

            filters.push({
                columName:
                    "itemCodeM",

                valueDefault:
                    formData.itemCodeM,

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        // ITEM NAME NODE
        if (formData.itemNameM) {

            filters.push({
                columName:
                    "itemNameM",

                valueDefault:
                    formData.itemNameM,

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        // ITEM GROUP
        if (formData.itemGroupM) {

            filters.push({
                columName:
                    "itemGroupM",

                valueDefault:
                    formData.itemGroupM,

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        // VERSION
        if (formData.BOMVersion) {

            filters.push({
                columName:
                    "BOMVersion",

                valueDefault:
                    formData.BOMVersion,

                dataValue:
                    "number",

                typeFilter:
                    "isEqualto"
            });
        }

        // STATUS
        if (formData.Status) {

            filters.push({
                columName:
                    "Status",

                valueDefault:
                    formData.Status,

                dataValue:
                    "number",

                typeFilter:
                    "isEqualto"
            });
        }

        // DEFAULT BOM
        if (formData.IsDefaultBOM) {

            filters.push({
                columName:
                    "IsDefaultBOM",

                valueDefault:
                    formData.IsDefaultBOM,

                dataValue:
                    "number",

                typeFilter:
                    "isEqualto"
            });
        }

        // ACTIVE
        if (formData.UseYN) {

            filters.push({
                columName:
                    "UseYN",

                valueDefault:
                    formData.UseYN,

                dataValue:
                    "number",

                typeFilter:
                    "isEqualto"
            });
        }

        return filters;
    };

    // =====================================
    // LOAD DATA
    // =====================================

    const loadData =
        useCallback(async () => {

            try {

                setLoading(true);
                const body = {

                    signature: 182,

                    functionCode:
                        "GETDATABYGRID",

                    isInit: true,

                    gridID: null,

                    skip:
                        (pageIndex - 1)
                        * pageSize,

                    take:
                        pageSize,

                    MenuCd:
                        "B011",

                    filtering:
                        buildFiltering(query)
                };

                console.log(
                    "REQUEST BODY:",
                    body
                );

                    await apiServer.getBomMaster(
        pageIndex,
        pageSize,
        buildFiltering()
    );

                console.log("FULL RESPONSE:", res);
                console.log(
                    "BOM API:",
                    res
                );

                // SAFE PARSE
                const list =
                    res?.Data?.List || [];
                // NORMALIZE
                const mapped =
                    list.map((x, i) => ({

                        ...x,

                        __id:
                            x.BOMDetailId ||
                            x.BOMId ||
                            x.ComponentItem ||
                            `row_${i}`,

                        ComponentItem:
                            x.ComponentItem || "-",

                        ComponentItemNm:
                            x.ComponentItemNm || "-",

                        BOMId:
                            x.BOMId || "-",

                        BOMVersion:
                            x.BOMVersion || 0,

                        Quantity:
                            x.Quantity || 0,

                        InventoryUOMNm:
                            x.InventoryUOMNm || "-",

                        DefaultWarehouse:
                            x.DefaultWarehouse || "-",

                        ItemsGroupName:
                            x.ItemsGroupName || "-",

                        CreateBy:
                            x.CreateBy || "-",

                        CreateDate:
                            x.CreateDate || "-"
                    }));

                setData(mapped);

                setTotalRows(
                    mapped[0]?.totalRows ||
                    res?.TotalRows ||
                    mapped.length
                );

            } catch (err) {

                console.log(
                    "BOM ERROR:",
                    err
                );

            } finally {

                setLoading(false);
            }

        }, [
            pageIndex,
            pageSize,
            query
        ]);

    // =====================================
    // FIRST LOAD
    // =====================================

    useEffect(() => {
        loadData();
    }, [pageIndex, pageSize, query]);

    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = () => {
        setQuery(formData); // CHỐT dữ liệu search
        setPageIndex(1);    // reset page nếu cần
    };

    const handleAdd = () => {
        setFormData (defaultForm);
        setOpenPopup(true);
    }
    // =====================================
    // REFRESH
    // =====================================

    const handleRefresh = () => {
        loadData();
    };

    // =====================================
    // CLEAR
    // =====================================

    const handleClear = () => {

        setFormData(defaultForm);

        setPageIndex(1);
    };

    // =====================================
    // PAGING
    // =====================================

    const onOptionChanged = (e) => {

    if (e.fullName === "paging.pageIndex") {

        const newPage = e.value + 1;

        if (newPage !== pageIndex) {
            setPageIndex(newPage);
        }
    }
};

const handleSave = async () => {

    try {

        const body = {

            signature: 182,

            MenuCd: "B011",

            functionCode: "ADD",

            data: {

                BOMDetailId:
                    formData.BOMDetailId || 0,

                BOMId:
                    formData.BOMId || 0,

                BOMRefId:
                    formData.BOMRefId || 0,

                ParentItem:
                    formData.ParentItem || null,

                ComponentItem:
                    formData.ComponentItem,

                ComponentItemNm:
                    formData.ComponentItemNm,

                BOMVersion:
                    formData.BOMVersion,

                Quantity:
                    formData.Quantity || 0,

                InventoryUOMNm:
                    formData.InventoryUOMNm,

                DefaultWarehouse:
                    formData.DefaultWarehouse,

                UseYN:
                    formData.UseYN,

                Status:
                    formData.Status
            }
        };

        console.log("SAVE BODY:", body);

        const res =
            await apiServer.post(
                "/Masterdata/DataService/Update",
                body
            );

        console.log("SAVE RES:", res);

        setOpenPopup(false);

        loadData();

    } catch (err) {

        console.log("SAVE ERROR:", err);
    }
};
    // =====================================
    // UI
    // =====================================
    return (

        <div className="app-content">

            <h2>BOM Master</h2>

            {/* =====================================
                SEARCH FORM
            ===================================== */}

            <form
                className="bom-search-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
            >

                <div className="bom-form-grid">

                    <input
                        type="text"
                        name="ComponentItem"
                        placeholder="Tree Code"
                        value={formData.ComponentItem}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="ComponentItemNm"
                        placeholder="Tree Name"
                        value={formData.ComponentItemNm}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="itemCodeM"
                        placeholder="Item Code Node"
                        value={formData.itemCodeM}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="itemNameM"
                        placeholder="Item Name Node"
                        value={formData.itemNameM}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="BOMVersion"
                        placeholder="Version"
                        value={formData.BOMVersion}
                        min={1}
                        max={10}
                        onChange={handleChange}
                    />

                    <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="1">
                            Active
                        </option>

                        <option value="0">
                            Inactive
                        </option>
                    </select>

                    <select
                        name="IsDefaultBOM"
                        value={formData.IsDefaultBOM}
                        onChange={handleChange}
                    >
                        <option value="">
                            Default BOM
                        </option>

                        <option value="1">
                            Yes
                        </option>

                        <option value="0">
                            No
                        </option>
                    </select>

                    <select
                        name="UseYN"
                        value={formData.UseYN}
                        onChange={handleChange}
                    >
                        <option value="">
                            Active
                        </option>

                        <option value="1">
                            Yes
                        </option>

                        <option value="0">
                            No
                        </option>
                    </select>

                </div>

                {/* =====================================
                    ACTIONS
                ===================================== */}

                <div className="bom-form-actions">

                    <button
                        type="button"
                        onClick={handleSave}
                    >
                        Add
                    </button>

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={handleClear}
                    >
                        Clear
                    </button>

                </div>

            </form>

            {/* =====================================
                GRID
            ===================================== */}

            <DataGrid
                dataSource={data}
                keyExpr="__id"
                showBorders={true}
                columnAutoWidth={true}
                rowAlternationEnabled={true}
                hoverStateEnabled={true}
                remoteOperations={false}
                onOptionChanged={onOptionChanged}
                loading={loading}
            >

                <SearchPanel visible={true} />

                <Paging pageSize={pageSize} 
                 pageIndex={pageIndex - 1} />

                <Pager
                    visible={true}
                    showInfo={true}
                    showPageSizeSelector={false}
                    infoText="Page {0} of {1} ({2} items)"
                />

                <Column
                    dataField="ComponentItem"
                    caption="Component Code"
                />

                <Column
                    dataField="ComponentItemNm"
                    caption="Component Name"
                />

                <Column
                    dataField="BOMId"
                    caption="BOM ID"
                />

                <Column
                    dataField="BOMVersion"
                    caption="Version"
                />

                <Column
                    dataField="Quantity"
                    caption="Qty"
                    dataType="number"
                />

                <Column
                    dataField="InventoryUOMNm"
                    caption="UOM"
                />

                <Column
                    dataField="ItemsGroupName"
                    caption="Group"
                />

                <Column
                    dataField="DefaultWarehouse"
                    caption="Warehouse"
                />

                <Column
                    dataField="CreateBy"
                    caption="Created By"
                />

                <Column
                    dataField="CreateDate"
                    caption="Created Date"
                />

            </DataGrid>

            <Popup
    visible={openPopup}
    onHiding={() => setOpenPopup(false)}
    title="Add BOM"
    showCloseButton={true}
    width={800}
    height={600}
>

    <div className="bom-popup-form">

    {/* Parent Item */}
    <input
        type="text"
        name="ParentItem"
        placeholder="Parent Item"
        value={formData.ParentItem || ""}
        onChange={handleChange}
    />

    {/* Parent Item Name */}
    <input
        type="text"
        name="ParentItemNm"
        placeholder="Parent Item Name"
        value={formData.ParentItemNm || ""}
        onChange={handleChange}
    />

    {/* Component Item */}
    <input
        type="text"
        name="ComponentItem"
        placeholder="Component Item"
        value={formData.ComponentItem || ""}
        onChange={handleChange}
    />

    {/* Component Item Name */}
    <input
        type="text"
        name="ComponentItemNm"
        placeholder="Component Item Name"
        value={formData.ComponentItemNm || ""}
        onChange={handleChange}
    />

    {/* Quantity */}
    <input
        type="number"
        name="Quantity"
        placeholder="Quantity"
        value={formData.Quantity || 0}
        onChange={handleChange}
    />

    {/* BOM Version */}
    <input
        type="number"
        name="BOMVersion"
        placeholder="BOM Version"
        value={formData.BOMVersion || 0}
        onChange={handleChange}
    />

    {/* UOM */}
    <input
        type="text"
        name="InventoryUOM"
        placeholder="Inventory UOM"
        value={formData.InventoryUOM || ""}
        onChange={handleChange}
    />

    {/* UOM Name */}
    <input
        type="text"
        name="InventoryUOMNm"
        placeholder="Inventory UOM Name"
        value={formData.InventoryUOMNm || ""}
        onChange={handleChange}
    />

    {/* Item Group Code */}
    <input
        type="number"
        name="ItemsGroupCode"
        placeholder="Items Group Code"
        value={formData.ItemsGroupCode || ""}
        onChange={handleChange}
    />

    {/* Item Group Name */}
    <input
        type="text"
        name="ItemsGroupName"
        placeholder="Items Group Name"
        value={formData.ItemsGroupName || ""}
        onChange={handleChange}
    />

    {/* Item Class */}
    <input
        type="text"
        name="U_ItemClas"
        placeholder="Item Class"
        value={formData.U_ItemClas || ""}
        onChange={handleChange}
    />

    {/* EONO */}
    <input
        type="text"
        name="EONO"
        placeholder="EONO"
        value={formData.EONO || ""}
        onChange={handleChange}
    />

    {/* Remark */}
    <textarea
        name="Remark"
        placeholder="Remark"
        value={formData.Remark || ""}
        onChange={handleChange}
    />

    {/* Status */}
    <select
        name="Status"
        value={formData.Status || ""}
        onChange={handleChange}
    >
        <option value="">
            Select Status
        </option>

        <option value="R">
            Release
        </option>

        <option value="D">
            Draft
        </option>
    </select>

    {/* Default BOM */}
    <select
        name="IsDefaultBOM"
        value={formData.IsDefaultBOM || "1"}
        onChange={handleChange}
    >
        <option value="1">
            Yes
        </option>

        <option value="0">
            No
        </option>
    </select>

    {/* Use YN */}
    <select
        name="UseYN"
        value={formData.UseYN || "1"}
        onChange={handleChange}
    >
        <option value="1">
            Active
        </option>

        <option value="0">
            Inactive
        </option>
    </select>

    {/* BUTTON */}
    <div className="popup-actions">

        <button
            type="button"
            onClick={handleSave}
        >
            Save
        </button>

        <button
            type="button"
            onClick={() => setOpenPopup(false)}
        >
            Cancel
        </button>

    </div>

</div>

</Popup>

            <div
                style={{
                    marginTop: 10
                }}
            >
                Total Rows:
                {" "}
                {totalRows}
            </div>

        </div>
    );
}