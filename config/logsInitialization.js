const logger = require("./logs/logger");
const { restResponseTimeHistogram, startMetricsServer } = require("./logs/metrics");
const responseTime = require("response-time");

const getResponseTime = (app) => {
    app.use(
        responseTime((req, res, time) => {
            if (req?.route?.path) {
                restResponseTimeHistogram.observe(
                    {
                        method: req.method,
                        route: req.route.path,
                        status_code: res.statusCode,
                    },
                    time * 1000
                );
            }
        })
    );
}
const connectLogger = () => {
    
}