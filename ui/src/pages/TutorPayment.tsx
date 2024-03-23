import { useParams } from "react-router";
import { StripePayment } from "../components/StripePayment";
import { GetTutorSlot, TutorPriceByTutor, TutorProfileById } from "../api/tutorsApi";
import { TutorSlot, TutorProfile, TutorPrice } from "../utils/types";
import { useState, useEffect } from "react";

const TutorPayment = () => {
    const slotid = useParams().slotid ?? '';
    const [slot, setSlot] = useState<TutorSlot>();    
    const [profile, setProfile] = useState<TutorProfile>();
    const [prices, setPrices] = useState<TutorPrice[]>([]);
    const [price, setPrice] = useState(0.00);
    const [selectedSubject, setSelectedSubject] = useState("");
    
    useEffect(() => {
        fetchSlot();
    }, [])

    useEffect(() => {
        for (const item of prices) {
            if (selectedSubject == "") {
                setPrice(0);
            } else if (selectedSubject == item.subjectlevel && slot?.duration!==undefined) {
                setPrice(item.price * slot?.duration);
            }
        }
    }, [prices, selectedSubject, slot?.duration])
    
    const fetchSlot = async () => {
        try {
            const slotData = await GetTutorSlot(slotid);
            setSlot(slotData[0]);
            fetchProfile(slotData[0].tutorid);
            fetchPrices(slotData[0].tutorid);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProfile = async (tutorid: number) => {
        try {
            const profileData = await TutorProfileById(tutorid);
            setProfile(profileData[0]);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchPrices = async (tutorid: number) => {
        try {
            const priceData = await TutorPriceByTutor(tutorid);
            setPrices(priceData);
            console.log(priceData)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                    <h1 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-gray-900 md:text-3xl lg:text-6xl dark:text-white">Payment page</h1>
                    {
                        slotid ?
                        <>
                            <div className="mx-auto block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                                <h5 className="flex mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    <img src={profile?.photolink} /> &emsp;&emsp;{profile?.name}
                                </h5>
                                <div className="flex justify-between text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">
                                    <span className="text-start">Date</span>
                                    <span className="text-end">
                                        {slot?.startat && new Date(slot.startat).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">
                                    <span className="text-start">Time</span>
                                    <span className="text-end">
                                        {slot?.startat && new Date(slot.startat).toLocaleTimeString('en-GB', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}
                                    </span>
                                </div>    
                                <div className="flex justify-between text-lg font-normal text-gray-500 dark:text-gray-400 mb-6">
                                    <span className="text-start">Duration</span>
                                    <span className="text-end">{slot?.duration}h Lesson</span>
                                </div> 
                                <form className="max-w-sm mx-auto">
                                    <label className="text-start block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject level</label>
                                    <select
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                    <option value="">Select...</option>
                                    {
                                        profile?.subjectlevel.map((subject) => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))        
                                    }
                                    </select>
                                </form>
                                <address className="mt-4 mb-4 relative bg-gray-50 dark:bg-gray-700 dark:border-gray-600 p-4 rounded-lg border border-gray-200 not-italic grid grid-cols-2">
                                        <div className="text-start space-y-2 text-gray-500 dark:text-gray-400 leading-loose hidden sm:block">
                                            Total <br />
                                        </div>
                                        <div id="contact-details" className="space-y-2 text-gray-900 dark:text-white font-medium leading-loose">
                                            $ {price} <br />
                                        </div>
                                </address>
                                <div className="mb-6">
                                    <label className="text-start mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Name of Card Holder</label>
                                    <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                                </div>    
                                <div>
                                    <StripePayment />
                                </div>
                            </div>
                        </>
                    : "There is an error with the payment."
                    }
                </div>
            </section>
        </div>
    )
}

export default TutorPayment;