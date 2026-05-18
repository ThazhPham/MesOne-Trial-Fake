import {
    useCallback,
    useEffect,
    useState
} from "react";

import ItemMasterPage from "./ItemMaster";
import apiServer from "../api/apiServer";

import Chart, {
    Series,
    ArgumentAxis,
    Legend,
    Tooltip
} from "devextreme-react/chart";

import { MdFolder, MdDashboard, MdSettings, MdStore } from "react-icons/md";

import "../css/PageDaskBoard.css";

// =====================================
// FORMAT NUMBER
// =====================================

const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

// =====================================
// PARSE DASHBOARD
// =====================================

const iconMap = {
    analytics: <MdDashboard />,
    settings: <MdSettings />,
    store: <MdStore />,
};

const parseDashboardSection = (
    data,
    key
) => {

    const value =
        data?.Data?.[key];

    if (!value) {
        return [];
    }

    return JSON.parse(value);
};

// =====================================
// DATE VALIDATION
// =====================================

const getDaysBetween = (
    startDate,
    endDate
) => {

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return 0;
    }

    return Math.floor(
        (end - start) / 86400000
    ) + 1;
};

const getDateRangeError = (
    fromDate,
    toDate
) => {

    if (!fromDate || !toDate) {

        return "Please select both from and to dates";
    }

    if (fromDate > toDate) {

        return "From date must be before to date";
    }

    if (
        getDaysBetween(
            fromDate,
            toDate
        ) > 31
    ) {

        return "Date range cannot exceed 31 days";
    }

    return null;
};


// Render Content




// =====================================
// BUILD MENU TREE
// =====================================

const buildMenuTree = (
    data,
    parent = ""
) => {

    return data

        .filter(
            (x) =>
                (x.menuGroup || "")
                    .trim() ===
                parent.trim()
        )

        .sort(
            (a, b) =>
                a.sortOrder -
                b.sortOrder
        )

        .map((item) => ({

            id:
                item.menuCd?.trim(),

            label:
                item.menuNm,

            icon:
                item.menuIcon,

            url:
                item.menuUrl,

            children:
                buildMenuTree(
                    data,
                    item.menuCd
                )
        }));
};

// =====================================
// COMPONENT
// =====================================

export default function PageDashboard() {

    // =====================================
    // SIDEBAR
    // =====================================

    const [isCollapsed, setIsCollapsed] =
        useState(false);

    const [openMenus, setOpenMenus] =
        useState({});

    const [menuGroups, setMenuGroups] =
        useState([]);

    // =====================================
    // DATE FILTER
    // =====================================

    const [fromDate, setFromDate] =
        useState("2026-05-01");

    const [toDate, setToDate] =
        useState("2026-05-15");

    const [temFromDate, setTemFromDate] =
        useState("2026-05-01");

    const [temToDate, setTemToDate] =
        useState("2026-05-15");

    // =====================================
    // DASHBOARD
    // =====================================

    const [dashboardData, setDashboardData] =
        useState(null);

    const [chartData, setChartData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    // =====================================
    // TAB
    // =====================================

    const DEFAULT_TAB = {
        id: "DB01",
        label: "Dashboard",
        icon: <MdDashboard />
    };

    const [tabs, setTabs] =
        useState([
            DEFAULT_TAB
        ]);

    const [selectedTab, setSelectedTab] =
        useState("DB01");

    // =====================================
    // LOAD MENU
    // =====================================

    useEffect(() => {

        const loadMenu =
            async () => {

                const menuData =
                    await apiServer.getMenu();

                console.log(
                    "MENU:",
                    menuData
                );

                const tree =
                    buildMenuTree(
                        menuData
                    );

                console.log(
                    "TREE:",
                    tree
                );

                setMenuGroups(tree);

                // AUTO OPEN ROOT
                const openObj = {};

                tree.forEach((x) => {

                    openObj[x.id] = true;
                });

                setOpenMenus(openObj);
            };

        loadMenu();

    }, []);

    // =====================================
    // TOGGLE MENU
    // =====================================

    const toggleMenu = (
        menuId
    ) => {

        setOpenMenus((prev) => ({
            ...prev,
            [menuId]:
                !prev[menuId]
        }));
    };

    // =====================================
    // LOAD DASHBOARD
    // =====================================

    const loadDashboard =
        useCallback(async () => {

            const dateRangeError =
                getDateRangeError(
                    fromDate,
                    toDate
                );

            if (dateRangeError) {

                setError(
                    dateRangeError
                );

                return;
            }

            try {

                setLoading(true);

                setError(null);

                const data =
                    await apiServer.getDashboardData(
                        fromDate,
                        toDate
                    );

                console.log(
                    "DASHBOARD:",
                    data
                );

                const summaryData =
                    parseDashboardSection(
                        data,
                        "SU00TT0001"
                    )[0] || {};

                const chart =
                    parseDashboardSection(
                        data,
                        "CH00TT0004"
                    );

                setDashboardData(
                    summaryData
                );

                setChartData(chart);

            } catch (err) {

                console.log(err);

                setError(
                    "Cannot load dashboard data"
                );

            } finally {

                setLoading(false);
            }

        }, [fromDate, toDate]);

    useEffect(() => {

        const timeoutId =
            setTimeout(
                loadDashboard,
                0
            );

        return () =>
            clearTimeout(timeoutId);

    }, [loadDashboard]);

    // =====================================
    // SEARCH
    // =====================================

    const handleSearch = () => {

        setFromDate(
            temFromDate
        );

        setToDate(
            temToDate
        );
    };

    // =====================================
    // TAB
    // =====================================

    const handleAddTab = (
        id,
        label,
        icon
    ) => {

        const tabId =
            id === "dashboard"
                ? "DB01"
                : id;

        const exists =
            tabs.find(
                (x) =>
                    x.id === tabId
            );

        if (!exists) {

            setTabs((prev) => [
                ...prev,
                {
                    id: tabId,
                    label,
                    icon
                }
            ]);
        }

        setSelectedTab(tabId);
    };

    const handleCloseTab = (
        e,
        tabId
    ) => {

        e.stopPropagation();

        setTabs((prevTabs) => {

            const newTabs =
                prevTabs.filter(
                    (x) =>
                        x.id !== tabId
                );

            if (
                selectedTab ===
                tabId
            ) {

                setSelectedTab(
                    newTabs[
                        newTabs.length - 1
                    ]?.id ||
                    ""
                );
            }

            return newTabs;
        });
    };

    // =====================================
    // RENDER MENU
    // =====================================

    const renderMenu = (
        menus,
        level = 0
    ) => {

        return menus.map((menu) => {

            const isOpen =
                openMenus[menu.id];

            const hasChildren =
                menu.children &&
                menu.children.length > 0;

            return (

                <div
                    key={menu.id}
                >

                    <button
                        className={`app-sidebar__item ${selectedTab ===
                            menu.id
                            ? "active"
                            : ""
                            }`}
                        style={{
                            paddingLeft:
                                16 +
                                level * 20
                        }}
                        onClick={() => {

                            if (
                                hasChildren
                            ) {

                                toggleMenu(
                                    menu.id
                                );

                            } else {

                                handleAddTab(
                                    menu.id,
                                    menu.label,
                                    iconMap[menu.icon] || <MdFolder />
                                );
                            }
                        }}
                    >

                        <span className="menu-icon">
                            {iconMap[menu.icon] || <MdFolder />}
                        </span>



                        {!isCollapsed && (
                            <>
                                <span
                                    className="app-sidebar__text"
                                >
                                    {
                                        menu.label
                                    }
                                </span>

                                {hasChildren && (
                                    <span
                                        style={{
                                            marginLeft:
                                                "auto"
                                        }}
                                    >
                                        {isOpen
                                            ? "▾"
                                            : "▸"}
                                    </span>
                                )}
                            </>
                        )}

                    </button>

                    {!isCollapsed &&
                        hasChildren &&
                        isOpen && (

                            <div>

                                {renderMenu(
                                    menu.children,
                                    level + 1
                                )}

                            </div>
                        )}

                </div>
            );
        });
    };

    // =====================================
    // ACTIVE TAB
    // =====================================

    const activeTab =
        tabs.find(
            (x) =>
                x.id ===
                selectedTab
        ) || DEFAULT_TAB;

    // =====================================
    // UI
    // =====================================

    return (

        <div className="app-layout">

            {/* SIDEBAR */}

            <div
                className={`app-sidebar ${isCollapsed
                    ? "collapsed"
                    : ""
                    }`}
            >

                {/* LOGO */}

                <div className="app-sidebar__logo">

                    {!isCollapsed && (

                        <div className="app-sidebar__brand">
                            MES
                        </div>

                    )}

                    <div
                        className="app-sidebar__toggle"
                        onClick={() =>
                            setIsCollapsed(
                                !isCollapsed
                            )
                        }
                    >
                        ☰
                    </div>

                </div>

                {/* MENU */}

                <div className="app-sidebar__menu">

                    {renderMenu(
                        menuGroups
                    )}

                </div>

                {/* FOOTER */}

                <div className="app-sidebar__footer">

                    {!isCollapsed &&
                        "Trade Team"}

                </div>

            </div>

            {/* MAIN */}

            <div
                className="app-main"
                style={{
                    marginLeft:
                        isCollapsed
                            ? 60
                            : 250
                }}
            >

                {/* TABBAR */}

                <div className="app-tabbar">

                    <div className="app-tabbar__tabs">

                        {tabs.map((tab) => (

                            <div
                                key={tab.id}
                                className={`app-tabbar__tab ${selectedTab ===
                                    tab.id
                                    ? "app-tabbar__tab--active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setSelectedTab(
                                        tab.id
                                    )
                                }
                            >

                                <span>
                                    {tab.icon}
                                </span>

                                <span>
                                    {tab.label}
                                </span>

                                {tab.id !==
                                    "dashboard" && (

                                        <span
                                            className="app-tabbar__close"
                                            onClick={(e) =>
                                                handleCloseTab(
                                                    e,
                                                    tab.id
                                                )
                                            }
                                        >
                                            ✕
                                        </span>

                                    )}

                            </div>

                        ))}

                    </div>

                </div>

                {/* CONTENT */}

                {
                    selectedTab === "DB01" ? (

                        <>
                            {/* DASHBOARD */}
                            <div className="dash-date-filter">

                                <input
                                    type="date"
                                    value={temFromDate}
                                    onChange={(e) =>
                                        setTemFromDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <span>~</span>

                                <input
                                    type="date"
                                    value={temToDate}
                                    onChange={(e) =>
                                        setTemToDate(
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    className="dash-refresh-btn"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>

                            </div>

                            <div className="app-content">

                                {loading && (
                                    <div>
                                        Loading...
                                    </div>
                                )}

                                {error && (
                                    <div>
                                        {error}
                                    </div>
                                )}

                                {!loading && !error && (

                                    <>
                                        {/* KPI */}
                                        <div className="dash-kpi-row">

                                            <div className="dash-kpi-card">
                                                <div>
                                                    Num Of WO
                                                </div>

                                                <div>
                                                    {formatNumber(
                                                        dashboardData?.NumOfWO
                                                    )}
                                                </div>
                                            </div>

                                            <div className="dash-kpi-card">
                                                <div>
                                                    Plan Qty
                                                </div>

                                                <div>
                                                    {formatNumber(
                                                        dashboardData?.PlanQty
                                                    )}
                                                </div>
                                            </div>

                                            <div className="dash-kpi-card">
                                                <div>
                                                    Actual Qty
                                                </div>

                                                <div>
                                                    {formatNumber(
                                                        dashboardData?.ActualQty
                                                    )}
                                                </div>
                                            </div>

                                            <div className="dash-kpi-card">
                                                <div>
                                                    NG Qty
                                                </div>

                                                <div>
                                                    {formatNumber(
                                                        dashboardData?.DefectQty
                                                    )}
                                                </div>
                                            </div>

                                        </div>

                                        {/* CHART */}
                                        <div className="dash-chart-card">

                                            <Chart
                                                dataSource={chartData}
                                                palette="Soft Blue"
                                            >

                                                <ArgumentAxis argumentType="string" />

                                                <Series
                                                    valueField="ProdQty"
                                                    argumentField="Key"
                                                    name="Production Qty"
                                                    type="bar"
                                                />

                                                <Series
                                                    valueField="DeliveryQty"
                                                    argumentField="Key"
                                                    name="Delivery Qty"
                                                    type="line"
                                                />

                                                <Legend
                                                    verticalAlignment="top"
                                                    horizontalAlignment="center"
                                                />

                                                <Tooltip enabled />

                                            </Chart>

                                        </div>

                                    </>
                                )}

                            </div>
                        </>

                    ) : selectedTab === "B009" ? (

                        <ItemMasterPage />

                    ) : (

                        <div className="app-content">

                            <div className="app-empty-tab">

                                <h2>
                                    {activeTab.label}
                                </h2>

                                <p>
                                    Chưa có nội dung.
                                </p>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>
    );
}
