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
            data.userId ||
            data.uuid ||
            '';

        this.userName =
            data.userName ||
            data.name ||
            '';

        this.displayName =
            data.displayName ||
            data.userName ||
            data.name ||
            data.userId ||
            '';

        this.role =
            data.role ||
            data.position ||
            data.positionName ||
            '';

        this.deptCd =
            data.deptCd ||
            '';

        this.deptNm =
            data.deptNm ||
            data.departmentName ||
            '';

        this.positionName =
            data.positionName ||
            data.position ||
            data.role ||
            data.deptNm ||
            data.departmentName ||
            '';

        this.cardCode =
            data.cardCode ||
            '';

        this.cardName =
            data.cardName ||
            '';

        this.menus =
            Array.isArray(data.menus)
                ? data.menus
                : [];

        this.permissions =
            data.permissions ||
            null;

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

            const userProfile = {
                userId: user.userId,
                userName: user.userName,
                displayName: user.displayName,
                role: user.role,
                deptCd: user.deptCd,
                deptNm: user.deptNm,
                positionName: user.positionName,
                cardCode: user.cardCode,
                cardName: user.cardName,
                menus: user.menus,
                permissions: user.permissions
            };

            localStorage.setItem(
                'token',
                user.access_token
            );

            localStorage.setItem(
                'user',
                JSON.stringify(userProfile)
            );

            localStorage.setItem(
                'currentUser',
                JSON.stringify({
                    uuid: user.userId,
                    data: {
                        displayName:
                            user.displayName
                    },
                    role: user.role,
                    deptCd: user.deptCd,
                    deptNm: user.deptNm,
                    cardCode: user.cardCode,
                    cardName: user.cardName,
                    accessMenus: user.menus,
                    permissions: user.permissions
                })
            );

            if (user.access_token) {
                localStorage.setItem(
                    'jwt_access_token',
                    user.access_token
                );
            }

            if (user.refresh_token) {
                localStorage.setItem(
                    'refresh_token',
                    user.refresh_token
                );

                localStorage.setItem(
                    'rtoken',
                    user.refresh_token
                );
            }
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

    async getItemMaster(
        pageIndex = 1,
        pageSize = 20
    ) {

        const body = {
            Signature: 191,
            FunctionCode: "GETDATA",
            MenuCd: "B009",
            Type: 10,
            Skip:
                (pageIndex - 1) *
                pageSize,
            Take: pageSize,
            Filtering: [],
            Sortings: []
        };

        return await this.repository.post(
            '/Masterdata/DataService/GetData',
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
            Signature: 189,
            FunctionCode: "GETDATA",
            MenuCd: "B011",
            Type: 10,
            Skip:
                (pageIndex - 1) *
                pageSize,
            Take: pageSize,
            Filtering: filtering,
            Sortings: []
        };

        return await this.repository.post(
            "/Masterdata/DataService/GetData",
            body
        );
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
