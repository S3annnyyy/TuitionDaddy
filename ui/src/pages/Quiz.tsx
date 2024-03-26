import React, { useEffect, useState } from "react";
import QuizDisplay from "../components/quiz/QuizDisplay.tsx";
import QuizSidebar from "../components/quiz/QuizSidebar.tsx";
// import Question from "../components/quiz/Question.tsx";
// import { useNavigate } from "react-router-dom";

const Quiz = () => {
    const [quizTitle, setQuizTitle] = useState("");
    const [pdf_pptx, setPdfPptx] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [numQns, setNumQns] = useState(0);
    const [questionType, setQuestionType] = useState("");
    const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
    // const navigate = useNavigate();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        throw new Error('User not identified. Please login to view quizzes.');
    }

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            if (!userId) {
                throw new Error('User not identified. Please login to view quizzes.');
            }

            const urlFetch = `http://localhost:2000/quiz/?userId=${userId}`;

            const req = await fetch(urlFetch);
            const data = await req.json();
            if (data.success && data.quizAvailable) {
                setQuizzes(data.quizzes);
            } else {
                setErrorMessage(data.message || 'Failed to fetch quizzes')
            }
        } catch {
            setErrorMessage('Failed to fetch quizzes');
        }
    };

    async function uploadQuiz() {
        try {
            const formData = new FormData();

            if (!pdf_pptx) {
                setErrorMessage("No file uploaded.");
                return;
            }
    
            formData.append("pdf_pptx", pdf_pptx);
            formData.append("quizTitle", quizTitle); 
            formData.append("numQns", `${numQns}`);
            formData.append("questionType", questionType);

            // Check if userID valid, otherwise user not identified
            if (userId) {
                formData.append("userId", userId);
            } else {
                setErrorMessage("User not identified. Please login to generate quizzes.");
                return;
            }

            const url = `http://localhost:2000/quiz/generate-quiz/`;            
    
            const req = await fetch(url, {
                method: 'POST',
                body: formData, 
            });
    
            const res = await req.json();
            if (res.success) {
                console.log("Quiz created successfully!");
                setErrorMessage(""); // Clear any existing error messages
                alert("Quiz created and uploaded successfully!"); // Alert the user
                fetchQuizzes(); // Fetch the updated list of quizzes
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(`Failed to create quiz: ${error}`);
        }
    }

    // this should be OnChange for a button thats under any of the 1 quizzes
    // async function submitQuiz (quizId, userAnswers) {
    //     try {
    //         const response = await fetch('http://localhost:2000/submit-quiz', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ quizId, answers: userAnswers }),
    //         });
    
    //         const data = await response.json();
    //         if (data.success) {
    //             alert(`Quiz submitted! Your score: ${data.quizScore}/${data.totalQuestions} (${data.scorePercentage}%)`);
    //         } else {
    //             setErrorMessage(data.message || 'Failed to submit quiz');
    //         }
    //     } catch (error) {
    //         setErrorMessage(`Error submitting quiz: ${error}`);
    //     }
    // }
    

    return (
        <div className='quiz-container'>
            {/* needa fetch quizzes from backend */}

            <QuizSidebar
                quizzes={quizzes}
                onSelectQuiz={setSelectedQuizIndex}
            />
            {selectedQuizIndex !== null && (
                <QuizDisplay quiz={quizzes[selectedQuizIndex]} />
            )}
            
            <main>
                <section>
                    <div>
                        Quiz Title: <br></br>
                        <input 
                            type="text" 
                            placeholder="Quiz Title" 
                            value={quizTitle} 
                            onChange={(e) => setQuizTitle(e.target.value)} 
                        />
                    </div>
                    Upload File: <br></br>
                    <input type="file" onChange={(e) => e.target.files && setPdfPptx(e.target.files[0])} />

                    <div>
                        Question Type: <br></br>
                        <input 
                            type="radio" 
                            name="questionType"
                            value="multiple choice"
                            checked={questionType === "multiple choice"}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Multiple Choice <br></br>
                        <input 
                            type="radio" 
                            name="questionType"
                            value="short answer"
                            checked={questionType === "short answer"}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Short Answer <br></br>
                    </div>

                    <div>
                        Number of Questions: <br></br>
                        <input 
                            type="radio" 
                            name="numQns"
                            value={5}
                            checked={numQns === 5}
                            onChange={(e) => setNumQns(parseInt(e.target.value))}
                        /> 1 Questions <br></br>
                        <input 
                            type="radio" 
                            name="numQns"
                            value={10}
                            checked={numQns === 10}
                            onChange={(e) => setNumQns(parseInt(e.target.value))}
                        /> 10 Questions <br></br>
                        <input 
                            type="radio" 
                            name="numQns"
                            value={15}
                            checked={numQns === 15}
                            onChange={(e) => setNumQns(parseInt(e.target.value))}
                        /> 15 Questions
                </div>

                {errorMessage && <h1>{errorMessage}</h1>}

                <button onClick={uploadQuiz}>Upload Quiz</button>
                </section>
            </main>

        </div>
    );
}

export default Quiz;
