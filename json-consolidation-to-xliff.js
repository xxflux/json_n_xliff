#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Consolidate two JSON files (source and target) into XLIFF format
 * Usage: node json-consolidation-to-xliff.js <source.json> <target.json> <output.xliff> [sourceLang] [targetLang]
 */

function showUsage() {
    console.log('Usage: node json-consolidation-to-xliff.js <source.json> <target.json> <output.xliff> [sourceLang] [targetLang]');
    console.log('');
    console.log('Parameters:');
    console.log('  source.json  - Path to the source JSON file (English)');
    console.log('  target.json  - Path to the target JSON file (Korean)');
    console.log('  output.xliff - Path for the output XLIFF file');
    console.log('  sourceLang   - Source language code (default: en)');
    console.log('  targetLang   - Target language code (default: ko)');
    console.log('');
    console.log('Examples:');
    console.log('  node json-consolidation-to-xliff.js source.json target.json output.xliff');
    console.log('  node json-consolidation-to-xliff.js source.json target.json output.xliff en ko');
    console.log('  node json-consolidation-to-xliff.js "json-consolidation-to-xliff/20250830 Korean Microsteps_Source.json" "json-consolidation-to-xliff/20250830 Korean Microsteps_Target.json" "json-consolidation-to-xliff/consolidated.xliff"');
}

function escapeXml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateXliffContent(sourceData, targetData, sourceLang, targetLang) {
    // Create a map of target data by UUID for quick lookup
    const targetMap = new Map();
    targetData.forEach(item => {
        if (item.uuid) {
            targetMap.set(item.uuid, item);
        }
    });

    let transUnits = '';
    let unitCount = 0;

    // Get translatable fields from the first source item (excluding 'uuid')
    const firstSourceItem = sourceData.find(item => item.uuid);
    if (!firstSourceItem) {
        throw new Error('No valid source items found with uuid field');
    }
    
    const translatableFields = Object.keys(firstSourceItem).filter(key => 
        key !== 'uuid' && 
        typeof firstSourceItem[key] === 'string' && 
        firstSourceItem[key].trim() !== ''
    );

    console.log(`Detected translatable fields: ${translatableFields.join(', ')}`);

    sourceData.forEach(sourceItem => {
        if (!sourceItem.uuid) {
            return; // Skip items without UUID
        }

        const targetItem = targetMap.get(sourceItem.uuid);
        if (!targetItem) {
            console.warn(`Warning: No target translation found for UUID: ${sourceItem.uuid}`);
            return;
        }

        // Create translation units for each translatable field
        translatableFields.forEach(fieldName => {
            const sourceText = sourceItem[fieldName];
            const targetText = targetItem[fieldName];
            
            // Skip empty source text
            if (!sourceText || typeof sourceText !== 'string' || sourceText.trim() === '') {
                return;
            }

            const unitId = `${sourceItem.uuid}_${fieldName}`;

            transUnits += `    <trans-unit id="${escapeXml(unitId)}">
      <source>${escapeXml(sourceText)}</source>
      <target>${escapeXml(targetText || '')}</target>
      <note>${escapeXml(fieldName)} for UUID: ${escapeXml(sourceItem.uuid)}</note>
    </trans-unit>
`;
            unitCount++;
        });
    });

    const xliffContent = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="consolidated_data" source-language="${sourceLang}" target-language="${targetLang}" datatype="plaintext">
    <header>
      <tool tool-id="json-consolidation-to-xliff" tool-name="JSON Consolidation to XLIFF Converter" tool-version="1.0.0"/>
    </header>
    <body>
${transUnits}    </body>
  </file>
</xliff>`;

    return { content: xliffContent, unitCount, fieldCount: translatableFields.length };
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3 || args.length > 5) {
        console.error('Error: Invalid number of arguments.');
        showUsage();
        process.exit(1);
    }
    
    const [sourceFile, targetFile, outputFile, sourceLang = 'en', targetLang = 'ko'] = args;
    
    // Check if input files exist
    if (!fs.existsSync(sourceFile)) {
        console.error(`Error: Source file '${sourceFile}' does not exist.`);
        process.exit(1);
    }
    
    if (!fs.existsSync(targetFile)) {
        console.error(`Error: Target file '${targetFile}' does not exist.`);
        process.exit(1);
    }
    
    try {
        console.log(`Reading source JSON from: ${sourceFile}`);
        console.log(`Reading target JSON from: ${targetFile}`);
        
        // Read and parse JSON files
        const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
        const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        
        // Validate JSON structure
        if (!Array.isArray(sourceData)) {
            console.error('Error: Source JSON file must contain an array of objects.');
            process.exit(1);
        }
        
        if (!Array.isArray(targetData)) {
            console.error('Error: Target JSON file must contain an array of objects.');
            process.exit(1);
        }
        
        console.log(`Source data contains ${sourceData.length} items`);
        console.log(`Target data contains ${targetData.length} items`);
        
        // Generate XLIFF content
        const { content: xliffContent, unitCount, fieldCount } = generateXliffContent(sourceData, targetData, sourceLang, targetLang);
        
        // Create output directory if it doesn't exist
        const outputDir = path.dirname(outputFile);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write XLIFF file
        fs.writeFileSync(outputFile, xliffContent, 'utf8');
        
        console.log(`✅ Successfully created consolidated XLIFF file: ${outputFile}`);
        console.log(`📊 Generated ${unitCount} translation units from ${sourceData.length} source items`);
        console.log(`📝 Processed ${fieldCount} translatable field(s) per item`);
        console.log(`🌍 Languages: ${sourceLang} → ${targetLang}`);
        
    } catch (error) {
        console.error('Error during consolidation:', error.message);
        if (error.code === 'ENOENT') {
            console.error('💡 Make sure the file paths are correct and files exist.');
        } else if (error instanceof SyntaxError) {
            console.error('💡 Make sure the JSON files contain valid JSON data.');
        }
        process.exit(1);
    }
}

// Run the script
main();
