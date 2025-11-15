import app from "./app.js";
import 'dotenv/config';

const PORT = process.env.PORT || 3000;


const startserver = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startserver();