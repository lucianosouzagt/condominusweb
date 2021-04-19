//const baseUrl = 'https://api.b7web.com.br/devcond/api/admin';
const baseUrl = 'http://127.0.0.1:8000/api/admin';
//const baseUrl = 'https://condominus.l7code.com.br/api';

const request = async (method, endpoint, params, token = null) => {
    method = method.toLowerCase();
    let fullUrl = `${baseUrl}${endpoint}`;
    let body = null;

    switch(method){
        case 'get':
            let queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        break;
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params);
        break;
    }

    let headers = {'Content-Type': 'application/json'};
    if(token){
        headers.Authorization = `Bearer ${token}`;
    }

    let req = await fetch(fullUrl, { method, headers, body });
    let json = await req.json();
    return json;
}

export default () => {
    return {
        getToken: () => {
            return localStorage.getItem('token');
        },
        validateToken: async () => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/auth/validate', {}, token);
            return json
        },
        login: async (email, password) => {
            let json = await request('post', '/auth/login', {email, password});
            return json;
        },
        logout: async (email, password) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/auth/logout', {token});
            localStorage.removeItem(token);
            return json;
        },
        getWall: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/walls', {}, token);
            return json
        },
        addWall: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', `/walls`, data, token);
            return json
        },
        updateWall: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/wall/${id}`, data, token);
            return json
        },
        removeWall: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/wall/${id}`, {}, token);
            return json
        },
        getDoc: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/docs', {}, token);
            return json
        },
        addDocFile: async (data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('title', data.title);
            if (data.file) {
                formData.append('doc', data.file);
            }
            
            let req = await fetch(`${baseUrl}/doc`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        updateDocFile: async (id, data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('title', data.title);
            if (data.file) {
                formData.append('doc', data.file);
            }
            
            let req = await fetch(`${baseUrl}/doc/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        removeDoc: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/doc/${id}`, {}, token);
            return json
        },
        getReservations: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/reservations', {}, token);
            return json
        },
        getUnits: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/units', {}, token);
            return json
        },
        getAreas: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/areas', {}, token);
            return json
        },
        addReservation: async (data) => {
            let token = localStorage.getItem('token');
            let json = await request('post', '/reservation', data, token);
            return json
        },
        updateReservation: async (id, data) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/reservation/${id}`, data, token);
            return json
        },
        removeReservation: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/reservation/${id}`, {}, token);
            return json
        },
        getBillet: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/billets', {}, token);
            return json
        },
        addBilletFile: async (data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('unit', data.unit);
            formData.append('title', data.title);
            if (data.file) {
                formData.append('billet', data.file);
            }
            
            let req = await fetch(`${baseUrl}/billet`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        updateBilletFile: async (id, data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('unit', data.unit);
            formData.append('title', data.title);
            if (data.file) {
                formData.append('billet', data.file);
            }
            
            let req = await fetch(`${baseUrl}/billet/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        removeBillet: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/billet/${id}`, {}, token);
            return json
        },
        getFoundAndLost: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/foundandlost', {}, token);
            return json
        },
        doneFoundAndLost: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('put', `/foundandlost/${id}`, {}, token);
            return json
        },
        addFoundAndLost: async (data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('description', data.description);
            formData.append('where', data.where);
            formData.append('photo', data.file);
            
            let req = await fetch(`${baseUrl}/foundandlost/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        updateFoundAndLost: async (id, data) => {
            let token = await localStorage.getItem('token');
            let formData = new FormData();
            formData.append('description', data.description);
            formData.append('where', data.where);
            if (data.file) {
                formData.append('photo', data.file);
            }
            
            let req = await fetch(`${baseUrl}/foundandlost/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            let json = await req.json();
            return json;
        },
        removeFoundAndLost: async (id) => {
            let token = localStorage.getItem('token');
            let json = await request('delete', `/foundandlost/${id}`, {}, token);
            return json
        },
        getWarnings: async () => {
            let token = localStorage.getItem('token');
            let json = await request('get', '/warnings', {}, token);
            return json
        },
    }
}