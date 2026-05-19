import { useCallback, useEffect, useState } from "react";
import apiServer from "../api/apiServer";

import Chart, {
    Series,
    ArgumentAxis,
    Legend,
    Tooltip
} from "devextreme-react/chart";

import { MdFolder, MdDashboard, MdSettings, MdStore } from "react-icons/md";

import "../css/PageDaskBoard.css";

const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

const parseDashboardSection = (data, key) => {

    const value = data?.Data?.[key];

    if (!value) {
        return [];
    }

    return JSON.parse(value);
};

const getDaysBetween = (startDate, endDate) => {

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    if (Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())) {
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

    if (getDaysBetween(fromDate, toDate) > 31) {
        return "Date range cannot exceed 31 days";
    }

    return null;
};

export default function PageDashboard() {

    const navigate = useNavigate();

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

    const [showChangePass, setShowChangePass] =
        useState(false);
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

    const loadDashboard = useCallback(async () => {

        const dateRangeError =
            getDateRangeError(
                fromDate,
                toDate
            );

        if (dateRangeError) {
            setError(dateRangeError);
            return;
        }

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

            const summaryData =
                parseDashboardSection(
                    data,
                    "SU00TT0001"
                )[0] || {};

            const chartData =
                parseDashboardSection(
                    data,
                    "CH00TT0004"
                );

            try {

                setLoading(true);

                setError(null);

            setDashboardData(summaryData);
            setChartData(chartData);

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
    }, [fromDate, toDate]);

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
    // ACTIVE TAB
    // =====================================

    const activeTab =
        tabs.find(
            (x) =>
                x.id ===
                selectedTab
        ) || DEFAULT_TAB;

    const [user, setUserState] = useState(readStoredUser);

    const [userOpen, setUserOpen] = useState(false);

    const userDisplayName =
        user.userName ||
        user.displayName ||
        user.userId ||
        "User";

    const userPositionName =
        user.positionName ||
        user.role ||
        user.deptNm ||
        "";

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("access_token");
        localStorage.removeItem("jwt_access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("rtoken");

        setUserState({});
        setUserOpen(false);
        navigate("/", { replace: true });
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = () => {
            setUserOpen(false);
        };

        const timeoutId =
            setTimeout(
                loadDashboard,
                0
            );

        return () =>
            clearTimeout(timeoutId);

    }, [loadDashboard]);

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
                                    "DB01" && (

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

                        {/* SEARCH */}

                        <button
                            className="dash-refresh-btn"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            Search
                        </button>

                    </div>

                    <div className="app-tabbar__right">

                        <div
                            className="user-box"
                            onClick={(e) => {
                                e.stopPropagation();
                                setUserOpen(!userOpen);
                            }}
                        >
                            <span className="user-box__name">
                                {userDisplayName}
                            </span>
                            {userPositionName && (
                                <span className="user-box__position">
                                    {userPositionName}
                                </span>
                            )}
                        </div>

                                    <div className="dash-kpi-value">
                                        {formatNumber(
                                            dashboardData?.NumOfWO
                                        )}
                                    </div>
                                </div>

                                <div className="dash-kpi-card">
                                    <div className="dash-kpi-title">
                                        Plan Quantity
                                    </div>

                                    <div className="dash-kpi-value">
                                        {formatNumber(
                                            dashboardData?.PlanQty
                                        )}
                                    </div>
                                </div>

                                <div className="dash-kpi-card">
                                    <div className="dash-kpi-title">
                                        OK Quantity
                                    </div>

                                    <div className="dash-kpi-value">
                                        {formatNumber(
                                            dashboardData?.ActualQty
                                        )}
                                    </div>
                                </div>

                                <div className="dash-kpi-card">
                                    <div className="dash-kpi-title">
                                        NG Quantity
                                    </div>

                                    <div className="dash-kpi-value">
                                        {formatNumber(
                                            dashboardData?.DefectQty
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* CONTENT */}

                {/* CONTENT */}
                {
                    selectedTab === "DB01" ? (

                                <Chart
                                    dataSource={chartData}
                                    palette="Soft Blue"
                                >
                                    Search
                                </button>

                            </div>

                            <div className="app-content">

                                {loading && <div>Loading...</div>}

                                {error && <div>{error}</div>}

                                {!loading && !error && (
                                    <>
                                        {/* KPI */}
                                        <div className="dash-kpi-row">
                                            <div className="dash-kpi-card">Num Of WO: {formatNumber(dashboardData?.NumOfWO)}</div>
                                            <div className="dash-kpi-card">Plan Qty: {formatNumber(dashboardData?.PlanQty)}</div>
                                            <div className="dash-kpi-card">Actual Qty: {formatNumber(dashboardData?.ActualQty)}</div>
                                            <div className="dash-kpi-card">NG Qty: {formatNumber(dashboardData?.DefectQty)}</div>
                                        </div>

                                        {/* CHART */}
                                        <div className="dash-chart-card">
                                            <Chart dataSource={chartData} palette="Soft Blue">
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

                                                <Legend verticalAlignment="top" horizontalAlignment="center" />
                                                <Tooltip enabled />
                                            </Chart>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>

                    ) : selectedTab === "B009" ? (

                        <ItemMasterPage />

                    ) : selectedTab === "B011" ? (

                        <BomMasterPage />

                    ) : (

                        <div className="app-content">
                            <div className="app-empty-tab">
                                <h2>{activeTab?.label}</h2>
                                <p>Chưa có nội dung.</p>
                            </div>
                        </div>

                    )
                }

            </div>

            <Popup
                visible={showChangePass}
                onHiding={() =>
                    setShowChangePass(false)
                }
                dragEnabled={false}
                hideOnOutsideClick={true}
                showCloseButton={true}
                showTitle={true}
                title="Đổi mật khẩu"
                width={420}
                height="auto"
            >
                <div className="change-pass-popup">
                    <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                    />
                    <input
                        type="password"
                        placeholder="Mật khẩu mới"
                    />
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                    />
                    <div className="change-pass-actions">
                        <button
                            type="button"
                            onClick={() =>
                                setShowChangePass(false)
                            }
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setShowChangePass(false)
                            }
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </Popup>

        </div>
    );
}
