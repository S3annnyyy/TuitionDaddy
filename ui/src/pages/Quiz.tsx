import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";

const Quiz = () => {
    const [quizTitle, setQuizTitle] = useState("");
    const [pdf_pptx, setPdfPptx] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [numQns, setNumQns] = useState(0);
    const [questionType, setQuestionType] = useState("");
    const navigate = useNavigate();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        throw new Error('User not identified');
    }

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const urlFetch = `http://localhost:2000/quiz/`;

            const req = await fetch(urlFetch);
            const data = await req.json();
            if (data.success) {
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
                setErrorMessage("User not identified");
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
            }
        } catch (error) {
            console.log(error);
            setErrorMessage(`Error occurred: ${error}`);
        }
    }

    return (
        <div className='quiz-container'>
            <aside className='sidebar'>
                {quizzes.map((quiz, index) => (
                    <div
                        key={index}
                        className='sidebar-item'
                        onClick={() => navigate(`/quiz/:id`)}
                    >
                        {quizTitle}
                    </div>
                ))}
            </aside>
            
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
