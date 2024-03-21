import { useParams } from "react-router";
import { TutorProfileById, TutorPriceByTutor, AvailableTutorSlotByTutor } from '../api/tutorsApi';
import { useEffect, useState } from "react";
import { TutorPrice, TutorProfile, TutorSlot } from "../utils/types";
import { FaBook, FaStreetView, FaCalendarAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { useNavigate } from "react-router";

const Tutor = () => {
    const tutorid = Number(useParams().tutorid);
    const [profile, setProfile] = useState<TutorProfile>();
    const [price, setPrice] = useState<TutorPrice[]>([]);
    const [slots, setSlots] = useState<TutorSlot[]>([])
    const [activeTab, setActiveTab] = useState("Experience");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])
    
    const fetchData = async () => {
        try {
            const profileData = await TutorProfileById(tutorid);
            const priceData = await TutorPriceByTutor(tutorid);
            const slotData = await AvailableTutorSlotByTutor(tutorid);
            setProfile(profileData[0]);
            setPrice(priceData);
            setSlots(slotData);
        } catch (error) {
            console.log(error);
        }
    }

    const tabs = [
        { tab: "Experience", icon: <FaStreetView /> },
        { tab: "Subjects", icon: <FaBook /> },
        { tab: "Pricing", icon: <FaMoneyCheckAlt /> },
        { tab: "Schedule", icon: <FaCalendarAlt /> }
    ]

    return (
        <div className="container m-4 flex">
            <div className="m-5 w-1/3 mx-auto">
                <div className="m-5">
                    <img src={profile?.photolink} alt="Tutor Photo" width="200"/>
                </div>
                <div className="m-5 text-left">
                    <p className="font-bold text-2xl">
                        {profile?.name}
                    </p>
                    <br />
                    <p className="text-xl">
                        {profile?.description}
                    </p>
                </div>
            </div>
            <div className="m-5 w-2/3 flex flex-col md:flex-row">
                <div className="w-3/4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end">
                        <button
                            onClick={() => navigate(`/`)}
                            type="button"
                            className="justify-end text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            Chat with Tutor
                        </button>
                    </div>
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                        {tabs.map((item) => 
                            <li key={item.tab} className="me-2">
                                <a
                                    href="#"
                                    onClick={() => setActiveTab(item.tab)}
                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${item.tab === activeTab ? 'text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500' : ''}`}
                                >
                                    {item.icon} &nbsp; {item.tab}
                                </a>
                            </li>
                        )}
                    </ul>
                    <br /> 
                    {activeTab === "Experience" && 
                        <div className="container text-sans mr-7">
                            {profile?.experience.replace(/\\n/g, '\n')}
                        </div>
                    }
                    {activeTab === "Subjects" &&
                        <ul>
                            <p className="font-bold">
                                Levels
                            </p>
                            {profile?.subjectlevel.map((subject) => 
                                <li key={subject}> &nbsp; {subject} </li>
                            )}
                        </ul>
                    }
                    {activeTab === "Pricing" &&
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                            Subject Level
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Price ($/h)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {price?.map((subject) => (
                                        <tr key={subject.rowid} className="border-b border-gray-200 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                                {subject.subjectlevel}
                                            </th>
                                            <td className="px-6 py-4">
                                                {subject.price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                    {activeTab === "Schedule" &&
                        <div>
                        {slots?.map((slot) => (
                            <div key={slot.slotid} className="p-0 mx-auto max-w-screen-xl">
                                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 md:p-12 mb-8">
                                    <div className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-blue-400 mb-2">
                                        <svg className="w-2.5 h-2.5 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                                            <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z"/>
                                        </svg>
                                        Zoom Meeting
                                    </div>
                                <h1 className="text-gray-900 dark:text-white text-3xl md:text-3xl font-extrabold mb-2">
                                    {new Date(slot.startat).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                    })}, {new Date(slot.startat).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </h1>
                                <span className="text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">Duration: {slot.duration}h</span>
                                <span className="flex justify-end">
                                    <div
                                        onClick={() => navigate(`/tutors/payment/${slot.slotid}`)}
                                        className="inline-flex justify-end items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
                                    >
                                        Book Slot
                                        <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                        </svg>
                                    </div>
                                </span>
                                </div>
                            </div>
                            ))
                        }
                        </div>
                    }
                </div>
            </div>
        </div>
            
    )
}
export default Tutor;