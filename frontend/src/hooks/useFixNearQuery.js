import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

// Categories Hook
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await api.categories.getAll();
      return data.categories;
    }
  });
}

// Technicians Hook
export function useTechnicians(filters = {}) {
  return useQuery({
    queryKey: ['technicians', filters],
    queryFn: async () => {
      const data = await api.technicians.getAll(filters);
      return data.technicians;
    }
  });
}

// Technician Detail Hook
export function useTechnicianDetail(id) {
  return useQuery({
    queryKey: ['technician', id],
    queryFn: async () => {
      const data = await api.technicians.getById(id);
      return data;
    },
    enabled: !!id
  });
}

// Bookings Hook
export function useBookings(params = {}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: async () => {
      const data = await api.bookings.getAll(params);
      return data.bookings;
    }
  });
}

// Admin Verifications Hook
export function useAdminVerifications() {
  return useQuery({
    queryKey: ['adminVerifications'],
    queryFn: async () => {
      const data = await api.admin.getVerifications();
      return data.verifications;
    }
  });
}

// Admin Complaints Hook
export function useAdminComplaints() {
  return useQuery({
    queryKey: ['adminComplaints'],
    queryFn: async () => {
      const data = await api.admin.getComplaints();
      return data.complaints;
    }
  });
}

// Admin Stats Hook
export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const data = await api.stats.getOverview();
      return data.stats;
    }
  });
}

// Mutations
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData) => api.bookings.create(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusData }) => api.bookings.updateStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => api.reviews.create(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      queryClient.invalidateQueries({ queryKey: ['technician'] });
    }
  });
}

export function useSubmitComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (complaintData) => api.admin.submitComplaint(complaintData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
    }
  });
}

export function useVerifyTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ techId, status }) => api.admin.verifyTechnician(techId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVerifications'] });
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      queryClient.invalidateQueries({ queryKey: ['technician'] });
    }
  });
}

export function useResolveComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resolutionData }) => api.admin.updateComplaint(id, resolutionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
    }
  });
}

// Payment Gateway Mutations (Razorpay / UPI Checkout)
export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: (orderData) => api.payments.createOrder(orderData)
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentData) => api.payments.verify(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    }
  });
}
