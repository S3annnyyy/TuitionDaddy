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
        <div>
            <h1 className="font-semibold text-gray-900 text-center">Quizzes</h1>
        </div>

        <div className="md:flex">
            <ul className="flex-column space-y space-y-2 text-sm font-medium text-gray-500 w-full mb-2 md:mb-0">
                {quizzes.map((quiz, index) => (
                    <li
                        key={index}
                        style={{
                            cursor: "pointer",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        onClick={() => onSelectQuiz(index)}
                    >
                        <a
                            href="#"
                            className="inline-flex items-center px-4 py-3 rounded-lg hover:text-gray-900 bg-gray-50 hover:bg-gray-100 w-full"
                            aria-current="page"
                        >
                            {quiz.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default QuizSidebar;
