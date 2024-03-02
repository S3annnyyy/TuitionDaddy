import quizRoutes from "./quiz/index.js";

function setupRoutes(app) {
    app.use("/quiz", quizRoutes);
}

export default {
    setupRoutes
};