import Axios, {AxiosRequestConfig} from "axios";

export const backend = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

export const backendBot = Axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

/**
 * axiosGet
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosGet = async (url: string) => {
    return get(backend, url)
}


/**
 * axiosGet
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosGetBlob = async (url: string) => {
    return getBlob(backend, url)
}

/**
 * axiosGet
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuthaaa
 */
export const get = async (client = backend, url: string) => {
    let config;
    let noAuth = localStorage.getItem("bearer") == null;

    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
        };
    }
    const response = await client.get(url, config)
    return response.data
};

export const getBlob = async (client = backend, url: string) => {
    let config: AxiosRequestConfig | undefined;
    let noAuth = localStorage.getItem("bearer") == null;

    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            responseType: 'blob'
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            responseType: 'blob'
        };
    }

    const response = await client.get(url, config)
    return response.data
};

/**
 * axiosPost
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosPost = async (url: string, request: any) => {
    return post(backend, url, request)
}

/**
 * axiosPost
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const post = async (client = backend, url: string, request: any) => {
    let config;
    let noAuth = localStorage.getItem("bearer") == null;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    }
    const response = await client.post(url, request, config);
    return response.data;
};

export const postFile = async (client = backend, url: string, request: any) => {
    let config;
    let noAuth = localStorage.getItem("bearer") == null;
    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    }
    const response = await client.post(url, request, config);
    return response.data;
};

/**
 * axiosDelete
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosDelete = async (url: string) => {
    return deleteRequest(backend, url)
}

/**
 * axiosDelete
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const deleteRequest = async (client = backend, url: string) => {
    let config;
    let noAuth = localStorage.getItem("bearer") == null;

    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
            onUploadProgress: (progressEvent: { loaded: any; }) => console.log(progressEvent.loaded)
        };
    }
    const response = await client.delete(url, config);
    return response.data
};

/**
 * axiosPut
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const axiosPut = async (url: string, request: any) => {
    return put(backend, url, request)
}

/**
 * putRequest
 * @param url can be a string
 * @param request can be a string or an object
 * @param noAuth
 */
export const put = async (client = backend, url: string, request: Array<any>) => {
    let config;
    let noAuth = localStorage.getItem("bearer") == null;

    if (noAuth) {
        config = {
            headers: {
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            }
        };
    } else {
        const token = localStorage.getItem('bearer');
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json;',
                'Access-Control-Allow-Origin': `${process.env.REACT_APP_DOMAIN_BASE}`
            },
        };
    }
    const response = await client.put(url, request, config);
    return response.data;
};
