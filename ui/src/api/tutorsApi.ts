import axios from 'axios';

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
