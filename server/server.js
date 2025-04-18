import express from "express";
import routes from "./routes/page.js"; // Ensure correct path and file extension
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    credentials: true,
}));
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
