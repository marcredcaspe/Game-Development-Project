import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import tool for path resolution

// Define __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Path to built files (assuming 'npm run build' outputs to root/dist)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.use((req, res, next) => { 
    // Send the index.html file from the built directory
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
        if (err) {
            // Handle error if index.html cannot be found
            next(err); 
        }
    });
});

app.listen(port, () => {
    console.log(`\n✅ Server is running and serving client files from: http://localhost:${port}`);
    console.log('Ensure you run "npm run build" first to create the client files in the /dist folder.');
});