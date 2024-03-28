import React from "react";
// import "../../Question.css"; // Import the external CSS file

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
        <div className="quizQuestion w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 ">
            <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl">
                {data.question}
            </h5>
            <ul className="my-4 space-y-3">
                {data.options.map((option, optionIndex) => (
                    // <div
                    //     key={optionIndex}
                    //     onClick={() =>
                    //         handleOptionSelect(optionIndex, option.isCorrect)
                    //     }
                    // >

                    <li
                        key={optionIndex}
                        style={{
                            cursor: "pointer",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                        }}
                        onClick={() => checkAns(optionIndex)}
                    >
                        <a className="flex items-center p-3 text-base text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow">
                            <span className="flex-1 ms-3 whitespace-nowrap">
                                {option.text}
                            </span>
                        </a>
                    </li>

                    // </div>
                ))}
            </ul>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                {data.explanation}
            </p>
        </div>
    );
};

export default Question;
