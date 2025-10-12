
const app = require('./app');
const { connectDB } = require('./database');

const PORT = process.env.PORT || 8080;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
})();