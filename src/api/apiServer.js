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

    async login(username, password) {

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

    async post(url, body) {

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

    async login(username, password) {

        const user =
            await this.repository.login(
                username,
                password
            );

        if (user) {

            localStorage.setItem(
                "token",
                user.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
        }

        return user;
    }

    async post(url, body) {

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

        const body = {

            signature: 398,

            functionCode:
                "GETDATACUSTOMIZE",

            MenuCd: "DB01",

            type: 10,

            filtering: [
                {
                    columName: "Date",

                    valueDefault:
                        `${dateFrom} 00:00:00`,

                    valueSecond:
                        `${dateTo} 23:59:59`,

                    dataValue:
                        "dateTime",

                    typeFilter:
                        "between"
                }
            ]
        };
        console.log(
            "DASHBOARD BODY:",
            body
        );

        return await this.repository.post(
            "/Inventory/DataService/GetData",
            body
        );
    }

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

    async getBomMaster(
    pageIndex = 1,
    pageSize = 20,
    filtering = []
) {

    const body = {

        signature: 182,

        functionCode: "GETDATABYGRID",

        isInit: true,

        gridID: null,

        skip:
            (pageIndex - 1) * pageSize,

        take:
            pageSize,

        MenuCd: "B011",

        filtering
    };

    return await this.repository.post(
        "/Masterdata/DataService/GetData",
        body
    );
}
}



// ======================
// EXPORT
// ======================

const authService =
    new AuthService();

export default authService;