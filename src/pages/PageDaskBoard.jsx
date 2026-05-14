import {
    useEffect,
    useState
} from 'react';

import DataGrid, {
    Column,
    Paging,
    SearchPanel
} from 'devextreme-react/data-grid';

import apiServer
    from '../api/apiServer';

export default function PageDashboard() {

    // =====================
    // STATE
    // =====================

    const [products, setProducts] =
        useState([]);

    // =====================
    // LOAD API
    // =====================

    const loadProducts =
        async () => {

            const result =
                await apiServer.postAPI(

                    '/api/product',

                    {
                        signature: 191,

                        functionCode:
                            'GETDATABYGRID',

                        isInit: true,

                        skip: 0,

                        take: 100,

                        sortings: [
                            {
                                columName:
                                    'CreateDate',

                                typeSorting:
                                    'DESC'
                            }
                        ],

                        filtering: [],

                        MenuCd: 'B009',

                        type: 0
                    }
                );

            console.log(result);

            // set data
            setProducts(
                result.data || []
            );
        };

    // =====================
    // AUTO LOAD
    // =====================

    useEffect(() => {

        loadProducts();

    }, []);

    // =====================
    // UI
    // =====================

    return (

        <div>

            <h2>
                Dashboard
            </h2>

            <DataGrid

                dataSource={products}

                showBorders={true}

            >

                <SearchPanel
                    visible={true}
                />

                <Paging
                    defaultPageSize={10}
                />

                <Column
                    dataField="ItemCode"
                    caption="Mã SP"
                />

                <Column
                    dataField="ItemName"
                    caption="Tên SP"
                />

                <Column
                    dataField="CreateDate"
                    caption="Ngày tạo"
                />

            </DataGrid>

        </div>
    );
}