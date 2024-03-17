import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

async function cleanQuiz(text) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant designed to output structured JSON data. Make use of every single line in the input text. Each question is following by options/possible answers. Provide a list of these options as an array of strings. The JSON schema is: { topics: [], questions: [{ question: '', options: [], correctAnswer: '', explanationOfCorrectAnswer: '' }] }.",
            },
            { role: "user", content: text },
        ]
    });

    try {
        const jsonResponse = JSON.parse(completion.choices[0].message.content);
        return JSON.stringify(jsonResponse);
    } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        throw error;
    }
}

export default { cleanQuiz };

// const zodSchema = z.object({
//     topics: z.array(z.string()).describe("A list of topics"),
//     questions: z.array(z.object({
//         question: z.string().describe("The question, the start of the question is indicated by a number"),
//         options: z.array(z.string()).describe("The options for the question, the start of the option is indicated by either A, B, C or D"),
//         answer: z.string().describe("The correct answer to the question"),
//         explanation: z.string().describe("The explanation of the correct answer"),
//     }))
// });