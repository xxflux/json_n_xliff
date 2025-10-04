#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Convert XLIFF file to JSON format
 * Usage: node xliff-to-json.js <input.xliff> <output.json> [sourceLang] [targetLang]
 */

function showUsage() {
    console.log('Usage: node xliff-to-json.js <input.xliff> <output.json> [sourceLang] [targetLang]');
    console.log('');
    console.log('Parameters:');
    console.log('  input.xliff  - Path to the source XLIFF file');
    console.log('  output.json  - Path for the output JSON file');
    console.log('  sourceLang   - Source language code (default: en)');
    console.log('  targetLang   - Target language code (default: ko)');
    console.log('');
    console.log('Examples:');
    console.log('  node xliff-to-json.js input.xliff output.json');
    console.log('  node xliff-to-json.js input.xliff output.json en ko');
    console.log('  node xliff-to-json.js "xliff_to_json/translated.xliff" "xliff_to_json/translated.json"');
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
        console.log(`Reading XLIFF from: ${inputFile}`);
        
        // Create temporary directory for CLI output
        const tempDir = path.dirname(outputFile);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // The CLI creates JSON files in the package directory, we need to prepare for them
        const packageDir = path.join(__dirname, 'node_modules', '@leading-works', 'json2xliff');
        const baseName = path.basename(inputFile);
        const generatedJsonName = `${baseName}_v1.0.0_${targetLang}.json`;
        const jsonFile = path.join(packageDir, generatedJsonName);
        
        try {
            // Clean up any existing output file first
            if (fs.existsSync(jsonFile)) {
                fs.unlinkSync(jsonFile);
            }
            
            // Use the CLI to convert XLIFF to JSON
            const cliCommand = `node "${path.join(__dirname, 'node_modules', '@leading-works', 'json2xliff', 'index.js')}" --srcLang "${sourceLang}" --trgLang "${targetLang}" --xliff "${inputFile}" --tag "v1.0.0"`;
            
            console.log('Running conversion...');
            const result = execSync(cliCommand, { 
                encoding: 'utf8',
                cwd: __dirname
            });
            
            if (!fs.existsSync(jsonFile)) {
                console.error('Error: Generated JSON file not found at:', jsonFile);
                // List files in package directory for debugging
                const packageFiles = fs.readdirSync(packageDir).filter(f => f.endsWith('.json'));
                console.error('Available JSON files in package directory:', packageFiles);
                process.exit(1);
            }
            
            // Read the generated JSON and transform it back to the original array format
            const flatJsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
            
            console.log(`Converting ${Object.keys(flatJsonData).length} translation units back to JSON structure...`);
            
            // Transform the flat structure back to the original JSON array format
            const transformedData = [];
            const processedUuids = new Set();
            
            // Group by UUID if the keys follow the pattern uuid_title/uuid_body
            Object.keys(flatJsonData).forEach(key => {
                const uuidMatch = key.match(/^([a-f0-9-]{36})_(title|body)$/);
                if (uuidMatch) {
                    const [, uuid, field] = uuidMatch;
                    
                    if (!processedUuids.has(uuid)) {
                        const titleKey = `${uuid}_title`;
                        const bodyKey = `${uuid}_body`;
                        
                        if (flatJsonData[titleKey] !== undefined || flatJsonData[bodyKey] !== undefined) {
                            transformedData.push({
                                title: flatJsonData[titleKey] || '',
                                body: flatJsonData[bodyKey] || '',
                                uuid: uuid
                            });
                            processedUuids.add(uuid);
                        }
                    }
                }
            });
            
            // If no UUID-based structure found, create a simple structure
            if (transformedData.length === 0) {
                Object.keys(flatJsonData).forEach((key, index) => {
                    transformedData.push({
                        title: key,
                        body: flatJsonData[key],
                        uuid: `generated-${Date.now()}-${index}`
                    });
                });
            }
            
            // Write the final JSON file with proper formatting
            fs.writeFileSync(outputFile, JSON.stringify(transformedData, null, 2), 'utf8');
            
            // Clean up the temporary JSON file created by the CLI
            if (jsonFile !== outputFile && fs.existsSync(jsonFile)) {
                fs.unlinkSync(jsonFile);
            }
            
            console.log(`✅ Successfully converted XLIFF to JSON: ${outputFile}`);
            console.log(`📊 Converted ${Object.keys(flatJsonData).length} translation units to ${transformedData.length} items`);
            console.log(`🌍 Languages: ${sourceLang} → ${targetLang}`);
            
        } catch (cliError) {
            console.error('CLI Error:', cliError.message);
            process.exit(1);
        }
        
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