
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
});

// Resume APIs
export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/resume/upload', formData); // Let browser set Content-Type with boundary
    return response.data;
};

// Interview APIs
export const startInterview = async (resumeId) => {
    const response = await api.post('/interview/start', null, {
        params: { resume_id: resumeId },
    });
    return response.data;
};

export const nextQuestion = async (sessionId, userAnswer, lastQuestion) => {
    const response = await api.post('/interview/next-question', {
        user_answer: userAnswer,
        last_question: lastQuestion,
    }, {
        params: { session_id: sessionId },
    });
    return response.data;
};

export const endInterview = async (sessionId) => {
    const response = await api.post('/interview/end', null, {
        params: { session_id: sessionId },
    });
    return response.data;
};

// Feedback API
export const getFeedback = async (sessionId) => {
    const response = await api.get(`/feedback/${sessionId}`);
    return response.data;
};

// Voice API
export const sendVoiceInput = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'input.wav');
    const response = await api.post('/voice/input', formData); // Let browser set Content-Type with boundary
    return response.data;
};

export const getTTS = async (text) => {
    const response = await api.post('/voice/speak', null, {
        params: { text },
    });
    // Assuming it returns URL or blob. If URL:
    return response.data.audio_url;
};

export default api;
