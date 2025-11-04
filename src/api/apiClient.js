// API client for project inquiries
// Use Vite env variable when available (VITE_API_BASE_URL), otherwise fallback to localhost
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/,'')
  : 'http://localhost:9000/api/v1';

export const submitProjectInquiry = async (inquiryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/project-inquiries/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error submitting inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getProjectInquiries = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/project-inquiries/?${queryParams}`);

    if (!response.ok) {
      throw new Error('Error fetching inquiries');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getProjectInquiryById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/project-inquiries/${id}`);

    if (!response.ok) {
      throw new Error('Error fetching inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};