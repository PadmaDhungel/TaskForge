import express from "express";
import routes from "./routes";

const app = express();
app.use(express.json());

app.use('/', routes);
app.use('/api/v1', routes);
//catch-all middleware for other routes than mentioned above
app.use((_req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
export default app;