import SearchBar from "../components/SearchBar";
import { SetStateAction, useEffect, useState } from "react";
import { SearchProfiles, TutorProfiles } from '../api/tutorsApi';
import { useNavigate } from "react-router";
import { TutorProfile } from "../utils/types";
import { FaBook } from "react-icons/fa";

const Tutors = () => {
    const [isTutor, setIsTutor] = useState(true);
    const [search, setSearch] = useState("");
    const [profiles, setProfiles] = useState<TutorProfile[]>([]);
    const navigate = useNavigate();

    const handleSearchChange = (value: SetStateAction<string>) => {
        setSearch(value);
        const fetchData = async () => {
            try {
                const data = await SearchProfiles(search);
                setProfiles(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    };

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
        const userID = sessionStorage.getItem("userid");
        if (userID) {
            profiles.forEach(profile => {
                if (profile?.tutorid == parseInt(userID)) {
                    setIsTutor(true);
                }
            });
        }
    }, [])

    return (
        <div>
            <div className="">
                {
                    isTutor && 
                    <button
                        onClick={() => navigate(`/`)}
                        type="button"
                        className="float-right mr-7 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                    >
                        Edit your profile
                    </button>
                }
                <SearchBar onSearchChange={handleSearchChange} />
            </div>
            {
                profiles.map((profile) => 
                    <div
                        onClick={() => navigate(`${profile.tutorid}`)}
                        key={profile.tutorid}
                        className="flex justify-items container block mx-auto md:w-1/2 w-full m-4 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        <img src={profile.photolink} width="250" className="w-1/4 object-contain" />
                        <div className="w-3/4 m-4 align-middle">
                            <p className="font-bold text-xl">{profile.name}</p>
                            <br /> 
                            <p>{profile.description}</p>
                            <br /> 
                            <p>
                                <span className="flex font">
                                    <FaBook/> &nbsp;
                                    {profile.subjectlevel.map((subject, index) => 
                                        index === profile.subjectlevel.length-1 ? subject : subject + ", "
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Tutors;