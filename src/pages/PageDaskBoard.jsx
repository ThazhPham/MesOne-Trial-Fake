import { useCallback, useEffect, useState } from "react";
import apiServer from "../api/apiServer";
import Chart, {
    Series,
    ArgumentAxis,
    Legend,
    Tooltip
} from "devextreme-react/chart";
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

    // =========================
    // SIDEBAR
    // =========================

    const [isCollapsed, setIsCollapsed] = useState(false);

    // =========================
    // DATE FILTER
    // =========================

    const [fromDate, setFromDate] =
        useState("2026-05-01");

    const [toDate, setToDate] =
        useState("2026-05-15");

    // =========================
    // DATA
    // =========================

    const [dashboardData, setDashboardData] =
        useState(null);

    const [chartData, setChartData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState(null);

    // =========================
    // LOAD DASHBOARD API
    // =========================

    // =========================
    // LOAD DASHBOARD API
    // =========================

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

            // =========================
            // PARSE CHART DATA
            // =========================

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

            console.log(
                "CHART DATA:",
                chartData
            );

            setDashboardData(summaryData);
            setChartData(chartData);

        } catch (err) {

            console.log(err);

            setError(
                "Cannot load dashboard data"
            );

        } finally {

            setLoading(false);
        }
    }, [fromDate, toDate]);

    // =========================
    // AUTO LOAD
    // =========================

    useEffect(() => {

        const timeoutId =
            setTimeout(
                loadDashboard,
                0
            );

        return () =>
            clearTimeout(timeoutId);

    }, [loadDashboard]);

    // =========================
    // SEARCH BUTTON
    // =========================

    const handleSearch = () => {

        loadDashboard();
    };

    return (

        <div className="app-layout">

            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <div
                className={
                    `app-sidebar ${isCollapsed
                        ? "collapsed"
                        : ""
                    }`
                }
            >

                <div className="app-sidebar__logo">

                    {!isCollapsed && (
                        <div className="app-sidebar__brand">
                            HANS
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

                <div className="app-sidebar__menu">

                    <div className="app-sidebar__item active">

                        <div className="app-sidebar__icon">
                            🏠
                        </div>

                        {!isCollapsed && (
                            <div className="app-sidebar__text">
                                Dashboard
                            </div>
                        )}

                    </div>

                    <div className="app-sidebar__item">

                        <div className="app-sidebar__icon">
                            📦
                        </div>

                        {!isCollapsed && (
                            <div className="app-sidebar__text">
                                Item
                            </div>
                        )}

                    </div>

                    <div className="app-sidebar__item">

                        <div className="app-sidebar__icon">
                            👤
                        </div>

                        {!isCollapsed && (
                            <div className="app-sidebar__text">
                                Employee
                            </div>
                        )}

                    </div>

                </div>

                <div className="app-sidebar__footer">

                    {!isCollapsed &&
                        "Trade Team"}

                </div>

            </div>

            {/* ========================= */}
            {/* MAIN */}
            {/* ========================= */}

            <div
                className="app-main"
                style={{
                    marginLeft:
                        isCollapsed
                            ? 60
                            : 250
                }}
            >

                {/* ========================= */}
                {/* TABBAR */}
                {/* ========================= */}

                <div className="app-tabbar">

                    <div className="app-tabbar__tab app-tabbar__tab--active">
                        Dashboard
                    </div>

                    {/* DATE FILTER */}

                    <div className="dash-date-filter">

                        {/* FROM */}

                        <div>

                            <div className="dash-date-label">
                                Req Date (from)
                            </div>

                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <span>~</span>

                        {/* TO */}

                        <div>

                            <div className="dash-date-label">
                                Req Date (to)
                            </div>

                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }
                            />

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

                </div>

                {/* ========================= */}
                {/* CONTENT */}
                {/* ========================= */}

                <div className="app-content">

                    {loading && (

                        <div className="dash-loading">

                            <div className="dash-spinner"></div>

                            <div>
                                Loading dashboard...
                            </div>

                        </div>
                    )}

                    {error && (

                        <div className="dash-error">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (

                        <>
                            {/* KPI */}

                            <div className="dash-kpi-row">

                                <div className="dash-kpi-card">
                                    <div className="dash-kpi-title">
                                        Num Of WO
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

                            {/* CHART */}

                            <div className="dash-chart-card">

                                <h3 className="dash-chart-title">
                                    Production & Delivery
                                </h3>

                                <Chart
                                    dataSource={chartData}
                                    palette="Soft Blue"
                                >

                                    {/* X AXIS */}
                                    <ArgumentAxis
                                        argumentType="string"
                                    />

                                    {/* BAR */}
                                    <Series
                                        valueField="ProdQty"
                                        argumentField="Key"
                                        name="Production Qty"
                                        type="bar"
                                    />

                                    {/* LINE */}
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

                                    <Tooltip enabled={true} />

                                </Chart>

                            </div>

                        </>
                    )}

                </div>

            </div>

        </div>
    );
}