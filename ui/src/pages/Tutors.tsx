import SearchBar from "../components/SearchBar";
import { SetStateAction, useEffect, useState } from "react";
import { TutorProfiles } from '../api/tutorsApi';


interface Tutor {
    tutorid: number,
    description: string,
    experience: string,
    subjectlevel: string[],
    photolink: string
}    

const Tutors = () => {
    const [, setSearch] = useState("");
    const [Profiles, setProfiles] = useState<Tutor[]>([])
    const handleSearchChange = (value: SetStateAction<string>) => {
        setSearch(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await TutorProfiles();
                setProfiles(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <SearchBar onSearchChange={handleSearchChange} />
            {
                Profiles.map((profile) => 
                    <div key={profile.tutorid} className="flex justify-items container block mx-auto md:w-1/2 w-full m-4 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <img src={profile.photolink} width="250" className="object-contain"/>
                        <div className="m-2 align-middle">
                            <p className="font-bold">{profile.description}</p>
                            <p>{profile.experience}</p>
                            <p>
                                <span className="">Subjects: </span>
                                <span>
                                    {profile.subjectlevel.map((subject, index) => 
                                        index === profile.subjectlevel.length-1 ? subject : subject + ", "
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
            )}
        </div>
    )
}

export default Tutors;