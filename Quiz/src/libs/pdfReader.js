import { TextractClient, GetDocumentTextDetectionCommand } from "@aws-sdk/client-textract";

const textractClient = new TextractClient({ region: process.env.AWS_DEFAULT_REGION });

//to initiate process textract
async function processTextract(jobId) {
    try {
        const finalResponse = await waitForTextractJobCompletion(jobId); // Implement polling logic here

        const extractedText = finalResponse.Blocks.filter(block => block.BlockType === 'LINE').map(line => line.Text).join('\n');
        
        return extractedText;
    } catch (error) {
        console.error('Error processing document with Textract or Mistral:', error);
        throw error; // Rethrow or handle as needed
    }
}

async function waitForTextractJobCompletion(jobId) {
    let jobStatus = "IN_PROGRESS";
    let response;

    while (jobStatus === "IN_PROGRESS") {
        response = await textractClient.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
        jobStatus = response.JobStatus;
        if (jobStatus === "IN_PROGRESS") {
            console.log("Job still in progress, waiting...");
            await new Promise(resolve => setTimeout(resolve, 15000)); // Adjust timing as needed
        }
    }

    if (jobStatus === "SUCCEEDED") {
        return response; // Return the final response for processing
    } else {
        throw new Error(`Textract job failed with status: ${jobStatus}`);
    }
}

export default { processTextract, waitForTextractJobCompletion };