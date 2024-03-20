// QuizSidebar.tsx
import React from "react";

interface Quiz {
    title: string;
    // Add more properties here as needed
}

interface QuizSidebarProps {
    quizzes: Quiz[];
    onSelectQuiz: (index: number) => void;
}

const QuizSidebar: React.FC<QuizSidebarProps> = ({ quizzes, onSelectQuiz }) => (
    
    <div
        style={{
            width: "200px",
            borderRight: "1px solid #ccc",
            padding: "10px",
        }}
    >
        <h3>Quizzes</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
            {quizzes.map((quiz, index) => (
                <li
                    key={index}
                    style={{ cursor: "pointer", marginBottom: "5px" }}
                    onClick={() => onSelectQuiz(index)}
                >
                    {quiz.title}
                </li>
            ))}
        </ul>
    </div>
);

export default QuizSidebar;
