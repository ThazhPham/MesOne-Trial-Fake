// import {
//     useEffect,
//     useState,
//     useCallback
// } from "react";

// import DataGrid, {
//     Column,
//     Paging,
//     Pager,
//     SearchPanel
// } from "devextreme-react/data-grid";

// import { Popup } from "devextreme-react/popup";

// import apiServer from "../api/apiServer";

// import "../css/BomMaster.css";

// export default function BomMasterPage() {

//     // =====================================
//     // GRID
//     // =====================================

//     const [data, setData] =
//         useState([]);

//     const [loading, setLoading] =
//         useState(false);

//     const [totalRows, setTotalRows] =
//         useState(0);

//     // =====================================
//     // PAGING
//     // =====================================

//     const [pageIndex, setPageIndex] =
//         useState(1);

//     const [pageSize] =
//         useState(20);

//     // =====================================
//     // FORM
//     // =====================================

//     const defaultForm = {

//         ParentItem: "",
//         ParentItemNm: "",

//         ComponentItem: "",
//         ComponentItemNm: "",

//         Quantity: 1,

//         BOMVersion: 1,

//         InventoryUOM: "",
//         InventoryUOMNm: "",

//         ItemsGroupCode: "",
//         ItemsGroupName: "",

//         U_ItemClas: "",

//         EONO: "",

//         Remark: "",

//         Status: "D",

//         IsDefaultBOM: "1",

//         UseYN: "1"
//     };

//     const [formData, setFormData] =
//         useState(defaultForm);

//     const [query, setQuery] =
//         useState(defaultForm);

//     const [openPopup, setOpenPopup] =
//         useState(false);

//     // =====================================
//     // HANDLE CHANGE
//     // =====================================

//     const handleChange = (e) => {

//         const { name, value } =
//             e.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     // =====================================
//     // BUILD FILTER
//     // =====================================

//     const buildFiltering = () => {

//     const filters = [];

//     if (query.ComponentItem) {

//         filters.push({
//             columName: "ComponentItem",
//             valueDefault: String(query.ComponentItem),
//             dataValue: "string",
//             typeFilter: "contains"
//         });
//     }

//     if (query.ComponentItemNm) {

//         filters.push({
//             columName: "ComponentItemNm",
//             valueDefault: String(query.ComponentItemNm),
//             dataValue: "string",
//             typeFilter: "contains"
//         });
//     }

//     if (query.itemCodeM) {

//         filters.push({
//             columName: "itemCodeM",
//             valueDefault: String(query.itemCodeM),
//             dataValue: "string",
//             typeFilter: "contains"
//         });
//     }

//     if (query.itemNameM) {

//         filters.push({
//             columName: "itemNameM",
//             valueDefault: String(query.itemNameM),
//             dataValue: "string",
//             typeFilter: "contains"
//         });
//     }

//     if (query.itemGroupM) {

//         filters.push({
//             columName: "itemGroupM",
//             valueDefault: String(query.itemGroupM),
//             dataValue: "string",
//             typeFilter: "contains"
//         });
//     }

//     if (
//         query.BOMVersion !== "" &&
//         query.BOMVersion !== null &&
//         query.BOMVersion !== undefined
//     ) {

//         filters.push({
//             columName: "BOMVersion",
//             valueDefault: String(query.BOMVersion),
//             dataValue: "number",
//             typeFilter: "isEqualto"
//         });
//     }

//     if (query.Status !== "") {

//         filters.push({
//             columName: "Status",
//             valueDefault: String(query.Status),
//             dataValue: "string",
//             typeFilter: "isEqualto"
//         });
//     }

//     if (query.IsDefaultBOM !== "") {

//         filters.push({
//             columName: "IsDefaultBOM",
//             valueDefault: String(query.IsDefaultBOM),
//             dataValue: "number",
//             typeFilter: "isEqualto"
//         });
//     }

//     if (query.UseYN !== "") {

//         filters.push({
//             columName: "UseYN",
//             valueDefault: String(query.UseYN),
//             dataValue: "number",
//             typeFilter: "isEqualto"
//         });
//     }

//     return filters;
// };

//     // =====================================
//     // LOAD DATA
//     // =====================================

//     const loadData = useCallback(async (overrideQuery) => {

//     try {

//         setLoading(true);

//         const currentQuery = overrideQuery ?? query;

//         const body = {

//             signature: 182,
//             functionCode: "GETDATABYGRID",
//             isInit: true,
//             gridID: null,

//             skip: (pageIndex - 1) * pageSize,
//             take: pageSize,

//             MenuCd: "B011",

//             filtering: buildFiltering(currentQuery)
//         };

//         const res = await apiServer.post(
//     "/Masterdata/DataService/GetData",
//     body
// );

// const list = res?.list || [];

//         const mapped = list.map((x, i) => ({

//             ...x,

//             __id:
//                 x.BOMDetailId ||
//                 x.BOMId ||
//                 `${i}`,

//             ComponentItem: x.ComponentItem || "-",
//             ComponentItemNm: x.ComponentItemNm || "-",
//             BOMId: x.BOMId || 0,
//             BOMVersion: x.BOMVersion || 0,
//             Quantity: x.Quantity || 0,
//             InventoryUOMNm: x.InventoryUOMNm || "-",
//             ItemsGroupName: x.ItemsGroupName || "-",
//             DefaultWarehouse: x.DefaultWarehouse || "-",
//             CreateBy: x.CreateBy || "-",
//             CreateDate: x.CreateDate || "-"

//         }));

//         setData(list.map((x, i) => ({
//     ...x,
//     __id: x.BOMId || i
// })));// ✔ QUAN TRỌNG
//         setTotalRows(res?.total || list.length);

//     } catch (err) {

//         console.log("LOAD ERROR:", err);

//     } finally {

//         setLoading(false);
//     }

// }, [pageIndex, pageSize, query]);

//     // =====================================
//     // FIRST LOAD
//     // =====================================

//     const [itemList, setItemList] = useState([]);

// useEffect(() => {
//     const loadItems = async () => {
//         const res = await apiServer.getItemMaster(1, 1000);
//         setItemList(res?.Data?.List || []);
//     };

//     loadItems();
// }, []);


//     // =====================================
//     // SEARCH
//     // =====================================

//     const handleSearch = () => {

//     setQuery(formData);

//     setPageIndex(1);

//     setTimeout(() => {
//         loadData(formData);
//     }, 0);
// };

//     // =====================================
//     // ADD
//     // =====================================

//     const handleAdd = () => {

//         setFormData(defaultForm);

//         setOpenPopup(true);
//     };

//     // =====================================
//     // REFRESH
//     // =====================================


//     const handleRefresh = () => {
//     loadData(query);
// };
    
//     // =====================================
//     // CLEAR
//     // =====================================

//    const handleClear = () => {

//     setFormData(defaultForm);
//     setQuery(defaultForm);
//     setPageIndex(1);

//     setTimeout(() => {
//         loadData(defaultForm);
//     }, 0);
// };

//     // =====================================
//     // PAGING
//     // =====================================

//     const onOptionChanged = (e) => {

//         if (
//             e.fullName ===
//             "paging.pageIndex"
//         ) {

//             const newPage =
//                 e.value + 1;

//             if (newPage !== pageIndex) {

//                 setPageIndex(newPage);
//             }
//         }
//     };

//     // =====================================
//     // SAVE
//     // =====================================

//     const handleSave = async () => {
//     try {
//         if (!formData.ComponentItem) {
//             alert("Component Item required");
//             return;
//         }

//         const payload = {
//             signature: 182,
//             MenuCd: "B011",
//             functionCode: "ADD",
//             data: {
//                 ParentItem: formData.ParentItem || "",
//                 ParentItemNm: formData.ParentItemNm || "",

//                 ComponentItem: formData.ComponentItem || "",
//                 ComponentItemNm: formData.ComponentItemNm || "",

//                 Quantity: Number(formData.Quantity || 1),
//                 BOMVersion: Number(formData.BOMVersion || 1),

//                 InventoryUOM: formData.InventoryUOM || "",
//                 InventoryUOMNm: formData.InventoryUOMNm || "",

//                 ItemsGroupCode: Number(formData.ItemsGroupCode || 0),
//                 ItemsGroupName: formData.ItemsGroupName || "",

//                 U_ItemClas: formData.U_ItemClas || "",
//                 EONO: formData.EONO || "",

//                 Remark: formData.Remark || "",

//                 Status: formData.Status || "D",

//                 IsDefaultBOM: formData.IsDefaultBOM === "1",
//                 UseYN: formData.UseYN === "1"
//             }
//         };

//         const res = await apiServer.post(
//             "/Masterdata/DataService/Update",
//             payload
//         );

//         if (res?.raw?.Success) {
//             alert("Add success");

//             setOpenPopup(false);

//             // reset form sau khi add
//             setFormData(defaultForm);

//             loadData();
//         } else {
//             alert(res?.raw?.SLTN || "Add failed");
//         }

//     } catch (err) {
//         console.log(err);
//         alert("Add error");
//     }
// };

//     // =====================================
//     // UI
//     // =====================================

//     return (

//         <div className="app-content">

//             <h2>
//                 BOM Master
//             </h2>

//             {/* SEARCH */}

//             <form
//                 className="bom-search-form"
//                 onSubmit={(e) => {

//                     e.preventDefault();

//                     handleSearch();
//                 }}
//             >

//                 <div className="bom-form-grid">

//                    <select
//                     name="ComponentItem"
//                     value={formData.ComponentItem}
//                     onChange={handleChange}
//                 >
//                     <option value="">-- Select Item --</option>
//                     {itemList.map(item => (
//                         <option key={item.ItemCode} value={item.ItemCode}>
//                             {item.ItemCode} - {item.ItemName}
//                         </option>
//                     ))}
//                 </select>

//                     <input
//                         type="text"
//                         name="ComponentItemNm"
//                         placeholder="Component Name"
//                         value={formData.ComponentItemNm}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="number"
//                         name="BOMVersion"
//                         placeholder="Version"
//                         value={formData.BOMVersion}
//                         onChange={handleChange}
//                     />

//                     <select
//                         name="Status"
//                         value={formData.Status}
//                         onChange={handleChange}
//                     >

//                         <option value="">
//                             All Status
//                         </option>

//                         <option value="D">
//                             Draft
//                         </option>

//                         <option value="R">
//                             Release
//                         </option>

//                     </select>

//                 </div>

//                 <div className="bom-form-actions">

//                     <button
//                         type="button"
//                         onClick={handleAdd}
//                     >
//                         Add
//                     </button>

//                     <button type="submit">
//                         Search
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleRefresh}
//                     >
//                         Refresh
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleClear}
//                     >
//                         Clear
//                     </button>

//                 </div>

//             </form>

//             {/* GRID */}

//             <DataGrid
//                 dataSource={data}
//                 keyExpr="__id"
//                 showBorders={true}
//                 columnAutoWidth={true}
//                 rowAlternationEnabled={true}
//                 hoverStateEnabled={true}
//                 remoteOperations={false}
//                 onOptionChanged={onOptionChanged}
//                 loading={loading}
//                 repaintchangesonly={true}
//             >

//                 <SearchPanel
//                     visible={true}
//                 />

//                 <Paging
//                     pageSize={pageSize}
//                     pageIndex={pageIndex - 1}
//                 />

//                 <Pager
//                     visible={true}
//                     showInfo={true}
//                     showPageSizeSelector={false}
//                     infoText="Page {0} of {1} ({2} items)"
//                 />

//                 <Column
//                     dataField="ComponentItem"
//                     caption="Component Code"
//                 />

//                 <Column
//                     dataField="ComponentItemNm"
//                     caption="Component Name"
//                 />

//                 <Column
//                     dataField="BOMId"
//                     caption="BOM ID"
//                 />

//                 <Column
//                     dataField="BOMVersion"
//                     caption="Version"
//                 />

//                 <Column
//                     dataField="Quantity"
//                     caption="Qty"
//                 />

//                 <Column
//                     dataField="InventoryUOMNm"
//                     caption="UOM"
//                 />

//                 <Column
//                     dataField="ItemsGroupName"
//                     caption="Group"
//                 />

//                 <Column
//                     dataField="DefaultWarehouse"
//                     caption="Warehouse"
//                 />

//                 <Column
//                     dataField="CreateBy"
//                     caption="Created By"
//                 />

//                 <Column
//                     dataField="CreateDate"
//                     caption="Created Date"
//                 />

//             </DataGrid>

//             {/* POPUP */}

//             <Popup
//                 visible={openPopup}
//                 onHiding={() =>
//                     setOpenPopup(false)
//                 }
//                 title="Add BOM"
//                 showCloseButton={true}
//                 width={800}
//                 height={650}
//             >

//                 <div className="bom-popup-form">

//                     <input
//                         type="text"
//                         name="ParentItem"
//                         placeholder="Parent Item"
//                         value={formData.ParentItem}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="text"
//                         name="ParentItemNm"
//                         placeholder="Parent Item Name"
//                         value={formData.ParentItemNm}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="text"
//                         name="ComponentItem"
//                         placeholder="Component Item"
//                         value={formData.ComponentItem}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="text"
//                         name="ComponentItemNm"
//                         placeholder="Component Item Name"
//                         value={formData.ComponentItemNm}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="number"
//                         name="Quantity"
//                         placeholder="Quantity"
//                         value={formData.Quantity}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="number"
//                         name="BOMVersion"
//                         placeholder="BOM Version"
//                         value={formData.BOMVersion}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="text"
//                         name="InventoryUOM"
//                         placeholder="Inventory UOM"
//                         value={formData.InventoryUOM}
//                         onChange={handleChange}
//                     />

//                     <input
//                         type="text"
//                         name="InventoryUOMNm"
//                         placeholder="Inventory UOM Name"
//                         value={formData.InventoryUOMNm}
//                         onChange={handleChange}
//                     />

//                     <textarea
//                         name="Remark"
//                         placeholder="Remark"
//                         value={formData.Remark}
//                         onChange={handleChange}
//                     />

//                     <select
//                         name="Status"
//                         value={formData.Status}
//                         onChange={handleChange}
//                     >

//                         <option value="D">
//                             Draft
//                         </option>

//                         <option value="R">
//                             Release
//                         </option>

//                     </select>

//                     <select
//                         name="IsDefaultBOM"
//                         value={formData.IsDefaultBOM}
//                         onChange={handleChange}
//                     >

//                         <option value="1">
//                             Yes
//                         </option>

//                         <option value="0">
//                             No
//                         </option>

//                     </select>

//                     <select
//                         name="UseYN"
//                         value={formData.UseYN}
//                         onChange={handleChange}
//                     >

//                         <option value="1">
//                             Active
//                         </option>

//                         <option value="0">
//                             Inactive
//                         </option>

//                     </select>

//                     <div className="popup-actions">

//                         <button
//                             type="button"
//                             onClick={handleSave}
//                         >
//                             Save
//                         </button>

//                         <button
//                             type="button"
//                             onClick={() =>
//                                 setOpenPopup(false)
//                             }
//                         >
//                             Cancel
//                         </button>

//                     </div>

//                 </div>

//             </Popup>

//             <div
//                 style={{
//                     marginTop: 10
//                 }}
//             >
//                 Total Rows:
//                 {" "}
//                 {totalRows}
//             </div>

//         </div>
//     );
// }







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

import { Popup } from "devextreme-react/popup";

import apiServer from "../api/apiServer";

import "../css/BomMaster.css";

export default function BomMasterPage() {

    // =========================
    // GRID
    // =========================

    const [data, setData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [totalRows, setTotalRows] =
        useState(0);

    // =========================
    // PAGING
    // =========================

    const [pageIndex, setPageIndex] =
        useState(1);

    const [pageSize] =
        useState(20);

    // =========================
    // FORM
    // =========================

    const defaultForm = {

        ParentItem: "",
        ParentItemNm: "",

        ComponentItem: "",
        ComponentItemNm: "",

        Quantity: 1,

        BOMVersion: 1,

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

    const [query, setQuery] =
        useState(defaultForm);

    const [openPopup, setOpenPopup] =
        useState(false);

    // =========================
    // ITEM LIST
    // =========================

    const [itemList, setItemList] =
        useState([]);

    // =========================
    // LOAD ITEM MASTER
    // =========================

    useEffect(() => {

    const loadItems = async () => {

        try {

            const res =
                await apiServer.getItemMaster(
                    1,
                    1000
                );

            console.log(
                "ITEM MASTER RAW:",
                res
            );

            // FIX HERE
            const list =
                res?.raw?.Data?.List ||
                res?.Data?.List ||
                res?.list ||
                [];

            console.log(
                "ITEM LIST:",
                list
            );

            setItemList(
                Array.isArray(list)
                    ? list
                    : []
            );

        } catch (err) {

            console.log(err);

            setItemList([]);
        }
    };

    loadItems();

}, []);

    // =========================
    // HANDLE CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } =
            e.target;

        // AUTO FILL ITEM NAME
        if (name === "ComponentItem") {

            const selected =
                itemList.find(
                    x =>
                        x.ItemCode === value
                );

            setFormData(prev => ({

                ...prev,

                ComponentItem:
                    value,

                ComponentItemNm:
                    selected?.ItemName || ""
            }));

            return;
        }

        setFormData(prev => ({

            ...prev,

            [name]: value
        }));
    };

    // =========================
    // BUILD FILTER
    // =========================

    const buildFiltering = (
        queryData
    ) => {

        const filters = [];

        if (queryData.ComponentItem) {

            filters.push({

                columName:
                    "ComponentItem",

                valueDefault:
                    String(
                        queryData.ComponentItem
                    ),

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        if (queryData.ComponentItemNm) {

            filters.push({

                columName:
                    "ComponentItemNm",

                valueDefault:
                    String(
                        queryData.ComponentItemNm
                    ),

                dataValue:
                    "string",

                typeFilter:
                    "contains"
            });
        }

        if (
            queryData.BOMVersion !== "" &&
            queryData.BOMVersion !== null &&
            queryData.BOMVersion !== undefined
        ) {

            filters.push({

                columName:
                    "BOMVersion",

                valueDefault:
                    String(
                        queryData.BOMVersion
                    ),

                dataValue:
                    "number",

                typeFilter:
                    "isEqualto"
            });
        }

        if (queryData.Status) {

            filters.push({

                columName:
                    "Status",

                valueDefault:
                    String(
                        queryData.Status
                    ),

                dataValue:
                    "string",

                typeFilter:
                    "isEqualto"
            });
        }

        return filters;
    };

    // =========================
    // LOAD DATA
    // =========================

    const loadData =
        useCallback(
            async (
                overrideQuery
            ) => {

                try {

                    setLoading(true);

                    const currentQuery =
                        overrideQuery ??
                        query;

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
                            buildFiltering(
                                currentQuery
                            )
                    };

                    console.log(
                        "LOAD BODY:",
                        body
                    );

                    const res =
                        await apiServer.post(
                            "/Masterdata/DataService/GetData",
                            body
                        );

                    console.log(
                        "LOAD RES:",
                        res
                    );

                    const list =
                        res?.list || [];

                    setData(

                        list.map(
                            (
                                x,
                                i
                            ) => ({

                                ...x,

                                __id:
                                    x.BOMId ||
                                    i,

                                ComponentItem:
                                    x.ComponentItem ||
                                    "-",

                                ComponentItemNm:
                                    x.ComponentItemNm ||
                                    "-",

                                BOMId:
                                    x.BOMId ||
                                    0,

                                BOMVersion:
                                    x.BOMVersion ||
                                    0,

                                Quantity:
                                    x.Quantity ||
                                    0,

                                InventoryUOMNm:
                                    x.InventoryUOMNm ||
                                    "-",

                                ItemsGroupName:
                                    x.ItemsGroupName ||
                                    "-",

                                DefaultWarehouse:
                                    x.DefaultWarehouse ||
                                    "-",

                                CreateBy:
                                    x.CreateBy ||
                                    "-",

                                CreateDate:
                                    x.CreateDate ||
                                    "-"
                            }))
                    );

                    setTotalRows(
                        res?.total ||
                        list.length
                    );

                } catch (err) {

                    console.log(
                        "LOAD ERROR:",
                        err
                    );

                } finally {

                    setLoading(false);
                }

            },
            [
                pageIndex,
                pageSize,
                query
            ]
        );

    // =========================
    // FIRST LOAD
    // =========================

    useEffect(() => {

        loadData();

    }, [pageIndex]);

    // =========================
    // SEARCH
    // =========================

    const handleSearch = () => {

        setQuery(formData);

        setPageIndex(1);

        setTimeout(() => {

            loadData(formData);

        }, 0);
    };

    // =========================
    // ADD
    // =========================

    const handleAdd = () => {

        setFormData(defaultForm);

        setOpenPopup(true);
    };

    // =========================
    // REFRESH
    // =========================

    const handleRefresh = () => {

        loadData(query);
    };

    // =========================
    // CLEAR
    // =========================

    const handleClear = () => {

        setFormData(defaultForm);

        setQuery(defaultForm);

        setPageIndex(1);

        setTimeout(() => {

            loadData(defaultForm);

        }, 0);
    };

    // =========================
    // PAGING
    // =========================

    const onOptionChanged = (e) => {

        if (
            e.fullName ===
            "paging.pageIndex"
        ) {

            const newPage =
                e.value + 1;

            if (
                newPage !==
                pageIndex
            ) {

                setPageIndex(
                    newPage
                );
            }
        }
    };

    // =========================
    // SAVE
    // =========================

    const handleSave =
        async () => {

            try {

                if (
                    !formData.ParentItem
                ) {

                    alert(
                        "Parent Item required"
                    );

                    return;
                }

                if (
                    !formData.ComponentItem
                ) {

                    alert(
                        "Component Item required"
                    );

                    return;
                }

                const payload = {

                    signature: 182,

                    MenuCd: "B011",

                    functionCode:
                        "ADD",

                    data: {

                        ParentItem:
                            formData.ParentItem,

                        ParentItemNm:
                            formData.ParentItemNm,

                        ComponentItem:
                            formData.ComponentItem,

                        ComponentItemNm:
                            formData.ComponentItemNm,

                        Quantity:
                            Number(
                                formData.Quantity
                            ),

                        BOMVersion:
                            Number(
                                formData.BOMVersion
                            ),

                        InventoryUOM:
                            formData.InventoryUOM,

                        InventoryUOMNm:
                            formData.InventoryUOMNm,

                        ItemsGroupCode:
                            formData.ItemsGroupCode,

                        ItemsGroupName:
                            formData.ItemsGroupName,

                        U_ItemClas:
                            formData.U_ItemClas,

                        EONO:
                            formData.EONO,

                        Remark:
                            formData.Remark,

                        Status:
                            formData.Status,

                        IsDefaultBOM:
                            formData.IsDefaultBOM ===
                            "1",

                        UseYN:
                            formData.UseYN ===
                            "1"
                    }
                };

                console.log(
                    "ADD BODY:",
                    payload
                );

                const res =
                    await apiServer.post(
                        "/Masterdata/DataService/Update",
                        payload
                    );

                console.log(
                    "ADD RESPONSE:",
                    res
                );

                alert(
                    "Add success"
                );

                setOpenPopup(
                    false
                );

                setFormData(
                    defaultForm
                );

                loadData();

            } catch (err) {

                console.log(
                    "ADD ERROR:",
                    err
                );

                alert(
                    "Add failed"
                );
            }
        };

    // =========================
    // UI
    // =========================

    return (

        <div className="app-content">

            <h2>
                BOM Master
            </h2>

            {/* SEARCH */}

            <form
                className="bom-search-form"
                onSubmit={(e) => {

                    e.preventDefault();

                    handleSearch();
                }}
            >

                <div className="bom-form-grid">

                    <select
                        name="ComponentItem"
                        value={
                            formData.ComponentItem
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            -- Select Item --
                        </option>

                        {itemList.map(
                            item => (

                                <option
                                    key={
                                        item.ItemCode
                                    }

                                    value={
                                        item.ItemCode
                                    }
                                >
                                    {item.ItemCode}
                                    {" - "}
                                    {item.ItemName}
                                </option>
                            )
                        )}

                    </select>

                    <input
                        type="text"
                        name="ComponentItemNm"
                        placeholder="Component Name"
                        value={
                            formData.ComponentItemNm
                        }
                        readOnly
                    />

                    <input
                        type="number"
                        name="BOMVersion"
                        placeholder="Version"
                        value={
                            formData.BOMVersion
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <select
                        name="Status"
                        value={
                            formData.Status
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="D">
                            Draft
                        </option>

                        <option value="R">
                            Release
                        </option>

                    </select>

                </div>

                <div className="bom-form-actions">

                    <button
                        type="button"
                        onClick={
                            handleAdd
                        }
                    >
                        Add
                    </button>

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleRefresh
                        }
                    >
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleClear
                        }
                    >
                        Clear
                    </button>

                </div>

            </form>

            {/* GRID */}

            <DataGrid
                dataSource={data}
                keyExpr="__id"
                showBorders={true}
                columnAutoWidth={true}
                rowAlternationEnabled={true}
                hoverStateEnabled={true}
                remoteOperations={false}
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
                    pageIndex={
                        pageIndex - 1
                    }
                />

                <Pager
                    visible={true}
                    showInfo={true}
                    showPageSizeSelector={
                        false
                    }
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

            {/* POPUP */}

            <Popup
                visible={openPopup}
                onHiding={() =>
                    setOpenPopup(false)
                }
                title="Add BOM"
                showCloseButton={true}
                width={800}
                height={650}
            >

                <div className="bom-popup-form">

                    <input
                        type="text"
                        name="ParentItem"
                        placeholder="Parent Item"
                        value={
                            formData.ParentItem
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="text"
                        name="ParentItemNm"
                        placeholder="Parent Item Name"
                        value={
                            formData.ParentItemNm
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <select
                        name="ComponentItem"
                        value={
                            formData.ComponentItem
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            -- Select Item --
                        </option>

                        {itemList.map(
                            item => (

                                <option
                                    key={
                                        item.ItemCode
                                    }

                                    value={
                                        item.ItemCode
                                    }
                                >
                                    {item.ItemCode}
                                    {" - "}
                                    {item.ItemName}
                                </option>
                            )
                        )}

                    </select>

                    <input
                        type="text"
                        name="ComponentItemNm"
                        value={
                            formData.ComponentItemNm
                        }
                        readOnly
                    />

                    <input
                        type="number"
                        name="Quantity"
                        placeholder="Quantity"
                        value={
                            formData.Quantity
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="number"
                        name="BOMVersion"
                        placeholder="BOM Version"
                        value={
                            formData.BOMVersion
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="text"
                        name="InventoryUOM"
                        placeholder="Inventory UOM"
                        value={
                            formData.InventoryUOM
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="text"
                        name="InventoryUOMNm"
                        placeholder="Inventory UOM Name"
                        value={
                            formData.InventoryUOMNm
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <textarea
                        name="Remark"
                        placeholder="Remark"
                        value={
                            formData.Remark
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <select
                        name="Status"
                        value={
                            formData.Status
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="D">
                            Draft
                        </option>

                        <option value="R">
                            Release
                        </option>

                    </select>

                    <select
                        name="IsDefaultBOM"
                        value={
                            formData.IsDefaultBOM
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="1">
                            Yes
                        </option>

                        <option value="0">
                            No
                        </option>

                    </select>

                    <select
                        name="UseYN"
                        value={
                            formData.UseYN
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="1">
                            Active
                        </option>

                        <option value="0">
                            Inactive
                        </option>

                    </select>

                    <div className="popup-actions">

                        <button
                            type="button"
                            onClick={
                                handleSave
                            }
                        >
                            Save
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setOpenPopup(
                                    false
                                )
                            }
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