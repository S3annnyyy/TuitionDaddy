import { TokenTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";
import { loadSummarizationChain } from "langchain/chains";
import { text } from "express";

async function generateQuiz(extractedText, num_qns, question_type) {
    const splitter = new TokenTextSplitter({
        chunkSize: 10000,
        chunkOverlap: 250,
    });

    const cleanedText = await extractedText.replace(/\n/g, ' ');

    const textSummary = await splitter.splitText(cleanedText);

    const inputForChain = {
        input_documents: textSummary.map(text => ({ pageContent: text, metadata: {} }))
    };

    const llmSummary = new ChatAnthropic({
        modelName: "claude-3-sonnet-20240229",
        anthropicApiKey: process.env.ANTHROPIC_KEY,
        temperature: 0.3,
    });

    const summaryTemplate = `
        You are an expert in summarizing texts and then finding the relevant topics.
        Your goal is to create a list of relevant topics of the text.

        Below you find the text:
        --------
        ${cleanedText}
        --------

        The transcript of the podcast will also be used as the basis for a ${question_type} questions and answer bot.
        Provide a ${num_qns} number of example ${question_type} questions and answers that could be asked about the text. Make these questions very specific.

        Total output will be a list of topics of the text and a list of ${num_qns} example ${question_type} questions the user could answer, along with the correct answer and explanation.

        LIST OF TOPICS AND QUESTIONS:
        `;

    const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

    const summaryRefineTemplate = `
        You are an expert in summarizing texts and then finding the relevant topics.
        Your goal is to create a list of relevant topics of the text.
        We have provided an existing list of topics up to a certain point: ${SUMMARY_PROMPT}
        
        Below you find the text:
        --------
        ${cleanedText}
        --------
        
        Given the new context, refine the list of topics and example questions.
        The text will also be used as the basis for a question and answer bot.
        Provide a ${num_qns} number of examples ${question_type} questions and answers that could be asked to the reader about the topics and text. Make
        these questions very specific.
        If the context isn't useful, return the original list of topics and questions.
        Total output will be a list of topics of the text and a list of ${num_qns} example ${question_type} questions the user could answer, along with the correct answers and explanation.
        
        LIST OF TOPICS AND QUESTIONS:
        `;

    const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
        summaryRefineTemplate
        );

    const summarizeChain = loadSummarizationChain(llmSummary, {
        type: "refine",
        verbose: true,
        questionPrompt: SUMMARY_PROMPT,
        refinePrompt: SUMMARY_REFINE_PROMPT,
        });

    

    try {
        const summary = await summarizeChain.invoke(inputForChain);
        return summary['output_text'];
    } catch (error) {
        console.error('Error processing document with summarizeChain:', error);
    }
}

export default { generateQuiz };