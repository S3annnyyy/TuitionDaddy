import axios from 'axios';
import { TutorProfile } from '../utils/types';

export const CreateTutorProfile = async (tutorProfile: TutorProfile) => {
    try {
        const response = await axios.post("http://localhost:5116/Tutor", tutorProfile)
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
}

export const TutorProfiles = async () => {
    try {
        const response = await axios.get("http://localhost:5116/Tutor/all"); 
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
};

export const SearchProfiles = async (search: string) => {
    try {
        const response = await axios.get(`http://localhost:5116/Tutor/search?search=${search}`); 
        return response.data;
    } catch (error) {
        console.error('Error fetching tutors:', error);
        throw error;
    }
};

export const TutorProfileById = async (tutorid: number) => {
    try {
        const response = await axios.get(`http://localhost:5116/Tutor/${tutorid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const TutorPriceByTutor = async (tutorid: number) => {
    try {
        const response = await axios.get(`http://localhost:5116/Tutor/price/${tutorid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const AvailableTutorSlotByTutor = async (tutorid: number) => {
    try {
        const response = await axios.get(`http://localhost:5116/Tutor/slots/available/${tutorid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}

export const GetTutorSlot = async (slotid: string) => {
    try {
        const response = await axios.get(`http://localhost:5116/Tutor/slots/${slotid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tutor:', error);
        throw error;
    }
}