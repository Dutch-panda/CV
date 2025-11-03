const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars'); // Only Handlebars imported

const cvDataPath = path.join(__dirname, '../src/cv-data.json');
const templatePath = path.join(__dirname, '../src/cv-template.html');
const outputDir = path.join(__dirname, '../output');
const outputPath = path.join(outputDir, 'index.html');
const outputCssPath = path.join(outputDir, 'styles.css');
const srcCssPath = path.join(__dirname, '../src/styles.css');

// 1. Read the HTML template
fs.readFile(templatePath, 'utf8', (err, templateSource) => {
    if (err) {
        console.error('Error reading template:', err);
        return;
    }

    // 2. Compile the template once
    const templateFunction = handlebars.compile(templateSource);
    
    // 3. Read CV data from JSON file
    fs.readFile(cvDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CV data:', err);
            return;
        }

        let cvData;
        try {
            cvData = JSON.parse(data);
        } catch (e) {
            console.error('Invalid JSON in CV.json:', e);
            return;
        }

        // 4. Render HTML with CV data (Handlebars syntax)
        const htmlOutput = templateFunction(cvData); 

        // 5. Ensure output dir exists and write files
        fs.mkdir(outputDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating output directory:', err);
                return;
            }

            // Write HTML
            fs.writeFile(outputPath, htmlOutput, (err) => {
                if (err) {
                    console.error('Error writing output HTML:', err);
                } else {
                    console.log('CV HTML generated successfully:', outputPath);
                }
            });

            // Copy CSS to output
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