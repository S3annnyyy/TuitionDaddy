import axios from 'axios';
import { TutorProfile } from '../utils/types';

export const CreateTutorProfile = async (tutorProfile: TutorProfile) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}`;
        const response = await axios.post(URL, tutorProfile);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
}

export const TutorProfiles = async () => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/all`;
        const response = await axios.get(URL); 
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
};

export const SearchProfiles = async (search: string) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/search?search=${search}`;
        const response = await axios.get(URL); 
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
};

export const TutorProfileById = async (tutorid: number) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/${tutorid}`;
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const TutorPriceByTutor = async (tutorid: number) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/price/${tutorid}`;
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const AvailableTutorSlotByTutor = async (tutorid: number) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/slots/available/${tutorid}`;
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const GetTutorSlot = async (slotid: string) => {
    try {
        const URL = `${import.meta.env.VITE_TUTOR_ENDPOINT}/slots/${slotid}`;
        const response = await axios.get(URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}