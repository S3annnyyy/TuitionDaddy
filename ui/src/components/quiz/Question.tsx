import React from "react";
import "../../Question.css"; // Import the external CSS file

interface Option {
    text: string;
    isCorrect: boolean;
}

interface QuestionData {
    question: string;
    options: Option[];
    explanation: string;
}

interface QuestionProps {
    data: QuestionData;
}

const Question: React.FC<QuestionProps> = ({ data }) => {
    const handleOptionSelect = (optionIndex: number, isCorrect: boolean) => {
        console.log(`Option ${optionIndex} selected. Correct: ${isCorrect}`);
    };

    return (
        <div className="quizQuestion">
            <h3>{data.question}</h3>
            {data.options.map((option, optionIndex) => (
                <div
                    key={optionIndex}
                    className="quizOption"
                    onClick={() =>
                        handleOptionSelect(optionIndex, option.isCorrect)
                    }
                >
                    {option.text}
                </div>
            ))}
            <p>{data.explanation}</p>
        </div>
    );
};

export default Question;
