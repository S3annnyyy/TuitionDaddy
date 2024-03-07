import quizRoutes from "./quizzes/index.js";

function setupRoutes(app) {
    app.use("/quizzes", quizRoutes);
}

export default {
    setupRoutes
};