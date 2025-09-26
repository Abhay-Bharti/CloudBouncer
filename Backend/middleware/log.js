const path = require('path');
const fs = require('fs');

// For serverless deployment (Vercel), we'll use console logging instead of file system
const isServerless = process.env.VERCEL || process.env.NODE_ENV === 'production';

let logDirectory, jsonLogFilePath;

if (!isServerless) {
  // Local development - use relative path
  logDirectory = path.join(__dirname, "../../logs");
  
  if (!fs.existsSync(logDirectory)) {
    try {
      fs.mkdirSync(logDirectory, { recursive: true });
    } catch (error) {
      console.warn('Could not create logs directory:', error.message);
    }
  }
  
  jsonLogFilePath = path.join(logDirectory, "logs.json");
}

// Function to append data to a JSON file (only for local development)
const appendLogToJsonFile = (data) => {
  if (isServerless) {
    // In serverless environment, just log to console
    console.log('Request Log:', JSON.stringify(data, null, 2));
    return;
  }

  let logs = [];
  
  // Check if the log file already exists and read existing logs
  if (fs.existsSync(jsonLogFilePath)) {
    try {
      const fileData = fs.readFileSync(jsonLogFilePath, 'utf8');
      if (fileData) {
        logs = JSON.parse(fileData);
      }
    } catch (error) {
      console.error('Error reading log file:', error.message);
      logs = [];
    }
  }

  // Add new log entry to the existing logs
  logs.push(data);

  // Write updated logs back to the JSON file
  try {
    fs.writeFileSync(jsonLogFilePath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error writing to log file:', error.message);
  }
};

// Middleware to log requests in JSON format
function handleLog(req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  const logEntry = {
    timestamp: new Date().toISOString(), // ISO 8601 date-time format
    method: req.method,
    url: req.url,
    ip: ip,
    user_agent: req.headers['user-agent'],
    referrer: req.headers.referer || '',
    http_version: req.httpVersion,
    status_code: null, // Placeholder, we'll set it after response is finished
    response_size_bytes: 0, // Placeholder, we'll calculate this later
    query_params: req.query,
    body: req.body,
    cookies: req.headers.cookie || '',
  };

  res.on('finish', () => {
    logEntry.status_code = res.statusCode; // Set status code after the response is sent
    logEntry.response_size_bytes = res.getHeader('Content-Length') || 0; // Capture response size

    // Append log entry to JSON file
    appendLogToJsonFile(logEntry);
  });

  next();
};

module.exports = handleLog;
