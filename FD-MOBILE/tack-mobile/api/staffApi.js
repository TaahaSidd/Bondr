import apiClient from "./client";

export const staffApi = {

    // Staff
    getAllStaff:  ()     => apiClient.get('/staff/all'),
    addStaff:    (data)  => apiClient.post('/staff/add', data),

    // Attendance
    markAttendance:       (data)     => apiClient.post('/attendance/mark', data),
    getAttendanceByStaff: (staffId)  => apiClient.get(`/attendance/staff/${staffId}`),

    // Payments
    makePayment:         (data)     => apiClient.post('/payments/make', data),
    getPaymentsByStaff:  (staffId)  => apiClient.get(`/payments/staff/${staffId}`),

};