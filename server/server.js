import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";


// Initialize Express
const app = express();

// Connect to database
await connectDB()

// Middlewares
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send("API Working");
})

app.use('/api/auth', express.json(), authRouter)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)



// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});
