import express from "express";
import routes from "./routes";
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' })
});
// Mount all feature routes under /api/v1
app.use('/api/v1', routes);
export default app;