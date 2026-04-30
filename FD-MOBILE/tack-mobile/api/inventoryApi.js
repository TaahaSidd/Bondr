import apiClient from "./client";

export const inventoryApi = {

    //Raw Materials
    getMaterials: () => apiClient.get('/rawMaterials/all'),
    addMaterials: (data) => apiClient.post('/rawMaterials/add', data),

    //Products
    getProducts: () => apiClient.get('/products/all'),
    getProductById: (id) => apiClient.get(`/products/product/${id}`),
    createProduct: (data) => apiClient.post('/products/create', data),

    // Batches
    getBatches: () => apiClient.get('/batch/all'),
    createBatch: (data) => apiClient.post('/batch/create', data),

    //Order
    createOrder: (data) => apiClient.post('/order/create', data),
    getOrders: () => apiClient.get('/order/all'),

};