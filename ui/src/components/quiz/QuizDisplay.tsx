// QuizDisplay.tsx
import React from "react";
import Question from "./Question";

interface Option {
    text: string;
    isCorrect: boolean;
}

interface QuestionData {
    question: string;
    options: Option[];
    explanation: string;
}

interface Quiz {
    title: string;
    topics: string[];
    questions: QuestionData[];
}

interface QuizDisplayProps {
    quiz: Quiz;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz }) => (
    <div style={{ padding: "20px" }}>
        <h2>{quiz.title}</h2>
        <h4>Topics: {quiz.topics.join(", ")}</h4>
        {quiz.questions.map((question, index) => (
            <Question key={index} data={question} />
        ))}
    </div>
);

export default QuizDisplay;
