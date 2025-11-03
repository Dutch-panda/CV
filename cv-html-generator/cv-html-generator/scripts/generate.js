const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Define file paths relative to this script
const cvDataPath = path.join(__dirname, '../src/cv-data.json');
const templatePath = path.join(__dirname, '../src/cv-template.html');
const srcCssPath = path.join(__dirname, '../src/styles.css');

const outputDir = path.join(__dirname, '../output');
const outputPath = path.join(outputDir, 'index.html');
const outputCssPath = path.join(outputDir, 'styles.css');

// 1. Read the HTML template first
fs.readFile(templatePath, 'utf8', (err, templateSource) => {
    if (err) {
        console.error('Error reading template:', err);
        return;
    }

    // Compile the template (Handlebars needs the source code to compile)
    const templateFunction = handlebars.compile(templateSource);
    
    // 2. Read CV data from JSON file
    fs.readFile(cvDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CV data:', err);
            return;
        }

        let cvData;
        try {
            // Parse the data from the file content
            cvData = JSON.parse(data);
        } catch (e) {
            console.error('Invalid JSON in cv-data.json:', e);
            return;
        }

        // 3. Render HTML: Execute the compiled template with the parsed JSON data
        // Pass cvData directly as Handlebars uses the properties of the object passed
        const htmlOutput = templateFunction(cvData); 

        // 4. Ensure output dir exists (safeguard)
        fs.mkdir(outputDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating output directory:', err);
                return;
            }

            // 5. Write the generated HTML output
            fs.writeFile(outputPath, htmlOutput, (err) => {
                if (err) {
                    console.error('Error writing output HTML:', err);
                } else {
                    console.log('CV HTML generated successfully:', outputPath);
                }
            });

            // 6. Copy CSS file to output
            fs.copyFile(srcCssPath, outputCssPath, (err) => {
                if (err) {
                    console.error('Error copying CSS to output:', err);
                } else {
                    console.log('CSS copied to output:', outputCssPath);
                }
            });
        });
    });
});