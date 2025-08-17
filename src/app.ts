import express from "express";
import routes from "./routes/index";

import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/index';

const app = express();
app.use(express.json());

app.use('/', routes);
app.use('/api/v1', routes);
//catch-all middleware for other routes than mentioned above
// Handle 404 routes
app.use((_req, _res, next) => {
    next(new NotFoundError());
});

// Centralized error handler
app.use(errorHandler);

export default app;