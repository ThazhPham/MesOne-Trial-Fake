import axios from 'axios';

// ======================
// API CLIENT
// ======================

const api = axios.create({

    baseURL:
        'http://116.118.95.174:1115'

});

// AUTO TOKEN
api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem('token');

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

// ======================
// ENTITY
// ======================

class UserEntity {

    constructor(data = {}) {

        this.userId =
            data.userId || '';

        this.userName =
            data.userName || '';

        this.access_token =
            data.access_token || '';

        this.refresh_token =
            data.refresh_token || '';
    }
}

// ======================
// REPOSITORY
// ======================

class AuthRepository {

    async login(
        username,
        password
    ) {

        try {

            const formData =
                new URLSearchParams();

            formData.append(
                'username',
                username
            );

            formData.append(
                'password',
                password
            );

            formData.append(
                'grant_type',
                'password'
            );

            formData.append(
                'client_id',
                'ro.client'
            );

            formData.append(
                'client_secret',
                'secret'
            );

            const response =
                await api.post(

                    '/connect/token',

                    formData,

                    {
                        headers: {
                            'Content-Type':
                                'application/x-www-form-urlencoded'
                        }
                    }
                );

            return new UserEntity(
                response.data
            );

        } catch (err) {

            console.log(err);

            return null;
        }
    }

    // API CHUNG
    async post(
        url,
        body
    ) {

        try {

            const response =
                await api.post(
                    url,
                    body
                );

            return response.data;

        } catch (err) {

            console.log(err);

            return null;
        }
    }
}

// ======================
// SERVICE
// ======================

class AuthService {

    constructor() {

        this.repository =
            new AuthRepository();
    }

    async login(
        username,
        password
    ) {

        const user =
            await this.repository.login(
                username,
                password
            );

        if (user) {

            localStorage.setItem(
                'token',
                user.access_token
            );
        }

        return user;
    }

    async postAPI(
        url,
        body
    ) {

        return await this.repository.post(
            url,
            body
        );
    }

    // ======================
    // DASHBOARD
    // ======================

    async getDashboardData(
        dateFrom,
        dateTo
    ) {

        const filtering =
            (dateFrom && dateTo)
                ? [{
                    columName: "Date",
                    valueDefault: dateFrom,
                    valueSecond: dateTo,
                    dataValue: "dateTime",
                    typeFilter: "between"
                }]
                : [];

        const body = {

            signature: 398,

            functionCode:
                "GETDATACUSTOMIZE",

            MenuCd: "DB01",

            type: 10,

            filtering
        };

        return await this.repository.post(

            '/Inventory/DataService/GetData',

            body
        );
    }

    // ======================
    // ITEM MASTER
    // ======================

    // ======================
    // ITEM MASTER
    // ======================

    async getItemMaster(
        pageIndex = 1,
        pageSize = 20
    ) {

        const body = {

            signature: 191,

            functionCode: "GETDATA",

            MenuCd: "B009",

            pageIndex,

            pageSize
        };

        return await this.repository.post(

            "/Masterdata/DataService/GetData",

            body
        );
    }



    // ======================
    // BOM MASTER
    // ======================
    async getBomMaster(pageIndex = 1, pageSize = 20, itemId) {

        const filtering = [];

        if (itemId) {
            filtering.push({
                columName: "ComponentItem",
                valueDefault: itemId,
                dataValue: "string",
                typeFilter: "isEqualto"
            });
        }

        const body = {
            signature: 182,
            functionCode: "GETDATA",
            MenuCd: "B011",
            pageIndex,
            pageSize,
            filtering
        };

        const res = await this.repository.post(
            "/Masterdata/DataService/GetData",
            body
        );

        return res?.data || res;
    }

    // ======================
    // GET MENU
    // ======================

    async getMenu() {

        try {

            const { default: MENU_DATA } =
                await import('./menu.js');

            return MENU_DATA;

        } catch (err) {

            console.log(
                'Error loading menu:',
                err
            );

            return [];
        }
    }
}

// ======================
// EXPORT
// ======================

const authService =
    new AuthService();

export default authService;