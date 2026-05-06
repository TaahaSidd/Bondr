import apiClient from "./client";

export const inventoryApi = {

    // Raw Materials
    getMaterials: () => apiClient.get('/rawMaterials/all'),
    addMaterials: (data) => apiClient.post('/rawMaterials/add', data),

    // Products
    getProducts: () => apiClient.get('/products/all'),
    getProductById: (id) => apiClient.get(`/products/product/${id}`),
    createProduct: (data) => apiClient.post('/products/create', data),

    // Product detail — new endpoints
    getLastBatch: (id) => apiClient.get(`/products/${id}/last-batch`),
    getTotalProduction: (id) => apiClient.get(`/products/${id}/total-production`),
    getProductHistory: (id, days = 14, limit = 10) =>
        apiClient.get(`/products/${id}/order-history`, { params: { days, limit } }),

    // Batches
    getBatches: () => apiClient.get('/batch/all'),
    createBatch: (data) => apiClient.post('/batch/create', data),

    // Orders
    createOrder: (data) => apiClient.post('/order/create', data),
    getOrders: () => apiClient.get('/order/all'),
    recentOrders: () => apiClient.get('/order/recent'),

};