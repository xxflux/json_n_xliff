#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Convert JSON file to XLIFF format
 * Usage: node json-to-xliff.js <input.json> <output.xliff> [sourceLang] [targetLang]
 */

function showUsage() {
    console.log('Usage: node json-to-xliff.js <input.json> <output.xliff> [sourceLang] [targetLang]');
    console.log('');
    console.log('Parameters:');
    console.log('  input.json   - Path to the source JSON file');
    console.log('  output.xliff - Path for the output XLIFF file');
    console.log('  sourceLang   - Source language code (default: en)');
    console.log('  targetLang   - Target language code (default: ko)');
    console.log('');
    console.log('Examples:');
    console.log('  node json-to-xliff.js input.json output.xliff');
    console.log('  node json-to-xliff.js input.json output.xliff en ko');
    console.log('  node json-to-xliff.js "json_to_xliff/20250830 Korean Microsteps_Source.json" "json_to_xliff/korean_microsteps.xliff"');
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 2 || args.length > 4) {
        console.error('Error: Invalid number of arguments.');
        showUsage();
        process.exit(1);
    }
    
    const [inputFile, outputFile, sourceLang = 'en', targetLang = 'ko'] = args;
    
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
        console.error(`Error: Input file '${inputFile}' does not exist.`);
        process.exit(1);
    }
    
    try {
        console.log(`Reading JSON from: ${inputFile}`);
        
        // Read and parse JSON file
        const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
        
        // Validate JSON structure
        if (!Array.isArray(jsonData)) {
            console.error('Error: JSON file must contain an array of objects.');
            process.exit(1);
        }
        
        // Transform JSON data to the format expected by json2xliff CLI
        // The CLI expects a flat key-value JSON object
        const sourceJson = {};
        const targetJson = {};
        
        jsonData.forEach((item) => {
            if (item.uuid && item.title && item.body) {
                // Use UUID as the key for better identification
                sourceJson[`${item.uuid}_title`] = item.title;
                sourceJson[`${item.uuid}_body`] = item.body;
                // Initialize target with empty strings (to be translated)
                targetJson[`${item.uuid}_title`] = '';
                targetJson[`${item.uuid}_body`] = '';
            }
        });
        
        console.log(`Converting ${Object.keys(sourceJson).length} translation units...`);
        
        // Create temporary JSON files for the CLI
        const tempDir = path.dirname(outputFile);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const tempSourceFile = path.join(tempDir, `temp_source_${Date.now()}.json`);
        const tempTargetFile = path.join(tempDir, `temp_target_${Date.now()}.json`);
        
        // Write temporary JSON files
        fs.writeFileSync(tempSourceFile, JSON.stringify(sourceJson, null, 2), 'utf8');
        fs.writeFileSync(tempTargetFile, JSON.stringify(targetJson, null, 2), 'utf8');
        
        try {
            // Use the CLI to convert to XLIFF
            const cliCommand = `node "${path.join(__dirname, 'node_modules', '@leading-works', 'json2xliff', 'index.js')}" --srcLang "${sourceLang}" --trgLang "${targetLang}" --srcJson "${tempSourceFile}" --trgJson "${tempTargetFile}" --tag "v1.0.0"`;
            
            console.log('Running conversion...');
            const result = execSync(cliCommand, { 
                encoding: 'utf8',
                cwd: __dirname
            });
            
            // The CLI creates an XLIFF file in the package directory, we need to find it and move it
            const packageDir = path.join(__dirname, 'node_modules', '@leading-works', 'json2xliff');
            const tempBaseName = path.basename(tempSourceFile, '.json');
            const generatedXliffName = `${tempBaseName}_v1.0.0_${targetLang}.xlf`;
            const generatedPath = path.join(packageDir, generatedXliffName);
            
            if (fs.existsSync(generatedPath)) {
                fs.renameSync(generatedPath, outputFile);
                console.log(`✅ Successfully converted JSON to XLIFF: ${outputFile}`);
            } else {
                console.error('Error: Generated XLIFF file not found at:', generatedPath);
                // List files in package directory for debugging
                const packageFiles = fs.readdirSync(packageDir).filter(f => f.includes('temp') || f.endsWith('.xlf'));
                console.error('Available files in package directory:', packageFiles);
                process.exit(1);
            }
            
        } finally {
            // Clean up temporary files
            try {
                if (fs.existsSync(tempSourceFile)) fs.unlinkSync(tempSourceFile);
                if (fs.existsSync(tempTargetFile)) fs.unlinkSync(tempTargetFile);
            } catch (cleanupError) {
                console.warn('Warning: Could not clean up temporary files:', cleanupError.message);
            }
        }
        
        console.log(`📊 Converted ${jsonData.length} items (${Object.keys(sourceJson).length} translation units)`);
        console.log(`🌍 Languages: ${sourceLang} → ${targetLang}`);
        
    } catch (error) {
        console.error('Error during conversion:', error.message);
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error('\n💡 Make sure to install dependencies first:');
            console.error('   npm install');
        }
        process.exit(1);
    }
}

// Run the script
main();