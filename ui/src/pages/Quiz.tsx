// import React, { useState } from "react";
// import Question from "../components/quiz/Question"; // Adjust the import path as needed
import React, { useState } from "react";
import QuizSidebar from "../components/quiz/QuizSidebar";
import QuizDisplay from "../components/quiz/QuizDisplay";

// Define the structure of each question (assuming a structure, adjust as necessary)
// interface Option {
//     text: string;
//     isCorrect: boolean;
// }

// interface Topic {
//     question: string;
//     options: Option[];
//     explanation: string;
// }

// // Assuming quizData will have an array of topics
// interface QuizData {
//     topics: Topic[];
// }

const Quiz = () => {
    const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);

    // Example hard-coded data
    const quizzes = [
        {
            title: "General Knowledge",
            topics: ["Geography", "Science"],
            questions: [
                {
                    question: "What is the capital of France?",
                    options: [
                        { text: "Paris", isCorrect: true },
                        { text: "London", isCorrect: false },
                        { text: "Berlin", isCorrect: false },
                        { text: "Madrid", isCorrect: false },
                    ],
                    explanation: "The capital of France is Paris.",
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: [
                        { text: "Earth", isCorrect: false },
                        { text: "Mars", isCorrect: true },
                        { text: "Jupiter", isCorrect: false },
                        { text: "Saturn", isCorrect: false },
                    ],
                    explanation: "Mars is known as the Red Planet.",
                },
            ],
        },
        {
            title: "Mathematics",
            topics: ["Algebra", "Geometry"],
            questions: [
                {
                    question: "What is the square root of 64?",
                    options: [
                        { text: "6", isCorrect: false },
                        { text: "8", isCorrect: true },
                        { text: "7", isCorrect: false },
                        { text: "9", isCorrect: false },
                    ],
                    explanation: "The square root of 64 is 8.",
                },
            ],
        },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <QuizSidebar
                quizzes={quizzes}
                onSelectQuiz={setSelectedQuizIndex}
            />
            {selectedQuizIndex !== null && (
                <QuizDisplay quiz={quizzes[selectedQuizIndex]} />
            )}
        </div>
    );
};

// const Quiz = () => {
//     // const [text, setText] = useState("");
//     // const [file, setFile] = useState<File | null>(null);
//     // const [userInfo, setUserInfo] = useState({ name: "", id: "" });
//     // const [quizUuid, setQuizUuid] = useState("");

//     const [file, setFile] = useState<File | null>(null);
//     const [userInfo, setUserInfo] = useState({ name: "", id: "" });
//     const [quizData, setQuizData] = useState<QuizData | null>(null); // Now with a specified type

//     async function makeRequest() {
//         try {
//             const formData = new FormData();

//             if (!file) {
//                 return;
//             }

//             formData.append("file", file);
//             formData.append("name", userInfo.name);
//             formData.append("userId", userInfo.id);

//             const url = `http://localhost:8000/quiz/pdf/${userInfo.id}`;

//             const req = await fetch(url, {
//                 method: "POST",
//                 body: formData,
//             });

//             // const res = await req.text();
//             const res = await req.json(); // Assuming the response will be in JSON

//             // setText(res);
//             setQuizData(res); // Set the quiz data with the specified type
//         } catch (error) {
//             console.error(`Error occurred: ${error}`);
//             // console.log(error);
//             // setText(`Error occurred: ${error}`);
//         }
//     }

//     return (
//         // <>
//         //     <input
//         //         type="file"
//         //         onChange={(e) => e.target.files && setFile(e.target.files[0])}
//         //     />
//         //     <input
//         //         type="text"
//         //         placeholder="Name"
//         //         value={userInfo.name}
//         //         onChange={(e) =>
//         //             setUserInfo({ ...userInfo, name: e.target.value })
//         //         }
//         //     />
//         //     <input
//         //         type="text"
//         //         placeholder="ID"
//         //         value={userInfo.id}
//         //         onChange={(e) =>
//         //             setUserInfo({ ...userInfo, id: e.target.value })
//         //         }
//         //     />
//         //     <input
//         //         type="text"
//         //         placeholder="Quiz UUID"
//         //         value={quizUuid}
//         //         onChange={(e) => setQuizUuid(e.target.value)}
//         //     />
//         //     {text && <h1>{text}</h1>}
//         //     <button onClick={makeRequest}>Test</button>
//         // </>
//         <>
//             <input
//                 type="file"
//                 onChange={(e) => e.target.files && setFile(e.target.files[0])}
//             />
//             <input
//                 type="text"
//                 placeholder="Name"
//                 value={userInfo.name}
//                 onChange={(e) =>
//                     setUserInfo({ ...userInfo, name: e.target.value })
//                 }
//             />
//             <input
//                 type="text"
//                 placeholder="ID"
//                 value={userInfo.id}
//                 onChange={(e) =>
//                     setUserInfo({ ...userInfo, id: e.target.value })
//                 }
//             />
//             <button onClick={makeRequest}>Load Quiz</button>
//             {quizData &&
//                 quizData.topics.map((topic, index) => (
//                     <Question key={index} data={topic} />
//                 ))}
//         </>
//     );
// };

export default Quiz;
