export const checkHealth = (req, res) =>
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Server is healthy",
  });
