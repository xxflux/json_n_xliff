![alt text](https://github.com/xxflux/json_n_xliff/blob/main/json_xliff.png)

# JSON ↔ XLIFF Converter

Node.js scripts to convert between JSON and XLIFF (XML Localization Interchange File Format) files for translation workflows.

## 🚀 Features

- **Bidirectional conversion**: JSON ↔ XLIFF format conversion
- **JSON consolidation**: Merge source and target JSON files into single XLIFF
- **Command-line interface**: Easy automation and integration
- **UUID preservation**: Maintains original UUID structure for tracking
- **Multi-field support**: Handles both title and body content fields
- **Language configuration**: Configurable source and target languages
- **Professional compatibility**: Generated XLIFF files work with CAT tools
- **Error handling**: Comprehensive validation and error reporting
- **Automatic cleanup**: Manages temporary files during conversion

## 📋 Project Overview

This project provides Node.js scripts that leverage the `@leading-works/json2xliff` package to convert translation files between JSON and XLIFF formats. The scripts are designed specifically for translation workflows where content needs to be sent to translators using industry-standard XLIFF format.

### What Was Built

1. **JSON to XLIFF Converter** (`json-to-xliff.js`)
   - Converts JSON arrays to XLIFF 2.0 format
   - Preserves UUID-based structure for tracking
   - Supports configurable source/target languages
   - Handles complex nested content (title + body fields)

2. **XLIFF to JSON Converter** (`xliff-to-json.js`)
   - Converts XLIFF files back to original JSON structure
   - Reconstructs the array format from flat key-value pairs
   - Maintains UUID associations between title and body content
   - Supports translated content integration

3. **JSON Consolidation to XLIFF Converter** (`json-consolidation-to-xliff.js`)
   - Merges source and target JSON files into single XLIFF format
   - Creates consolidated XLIFF with English source and target translations
   - Maintains UUID matching between source and target files
   - Generates XLIFF 1.2 format compatible with translation tools

4. **Project Infrastructure**
   - Package configuration with proper dependencies
   - Executable scripts with proper permissions
   - Comprehensive documentation and examples
   - Error handling and validation

## 🛠 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /path/to/json_n_xliff
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

   This installs the required package:
   - `@leading-works/json2xliff` - Core conversion library

3. **Make scripts executable (if needed):**
   ```bash
   chmod +x json-to-xliff.js xliff-to-json.js json-consolidation-to-xliff.js
   ```

## 📖 Usage

### JSON to XLIFF Conversion

Convert a JSON file to XLIFF format for translation:

```bash
node json-to-xliff.js <input.json> <output.xliff> [sourceLang] [targetLang]
```

**Parameters:**
- `input.json` - Path to the source JSON file
- `output.xliff` - Path for the output XLIFF file  
- `sourceLang` - Source language code (default: `en`)
- `targetLang` - Target language code (default: `ko`)

**Examples:**
```bash
# Convert Korean microsteps file (using defaults: en → ko)
node json-to-xliff.js "json_to_xliff/20250830 Korean Microsteps_Source.json" "json_to_xliff/korean_microsteps.xliff"

# Convert with custom languages (English to French)
node json-to-xliff.js "json_to_xliff/source.json" "json_to_xliff/output.xliff" en fr

# Simple conversion with defaults
node json-to-xliff.js input.json output.xliff
```

**Using npm scripts:**
```bash
npm run json-to-xliff -- "json_to_xliff/source.json" "json_to_xliff/output.xliff"
```

### XLIFF to JSON Conversion

Convert a translated XLIFF file back to JSON format:

```bash
node xliff-to-json.js <input.xliff> <output.json> [sourceLang] [targetLang]
```

**Parameters:**
- `input.xliff` - Path to the source XLIFF file
- `output.json` - Path for the output JSON file
- `sourceLang` - Source language code (default: `en`)  
- `targetLang` - Target language code (default: `ko`)

**Examples:**
```bash
# Convert translated XLIFF back to JSON
node xliff-to-json.js "xliff_to_json/translated.xliff" "xliff_to_json/translated.json"

# Convert with custom languages
node xliff-to-json.js "xliff_to_json/source.xliff" "xliff_to_json/output.json" en fr

# Simple conversion
node xliff-to-json.js input.xliff output.json
```

**Using npm scripts:**
```bash
npm run xliff-to-json -- "xliff_to_json/source.xliff" "xliff_to_json/output.json"
```

### JSON Consolidation to XLIFF Conversion

Merge two JSON files (source and target translations) into a single XLIFF file:

```bash
node json-consolidation-to-xliff.js <source.json> <target.json> <output.xliff> [sourceLang] [targetLang]
```

**Parameters:**
- `source.json` - Path to the source JSON file (English content)
- `target.json` - Path to the target JSON file (translated content)
- `output.xliff` - Path for the output consolidated XLIFF file
- `sourceLang` - Source language code (default: `en`)
- `targetLang` - Target language code (default: `ko`)

**Examples:**
```bash
# Consolidate Korean microsteps files (using defaults: en → ko)
node json-consolidation-to-xliff.js "json-consolidation-to-xliff/20250830 Korean Microsteps_Source.json" "json-consolidation-to-xliff/20250830 Korean Microsteps_Target.json" "json-consolidation-to-xliff/consolidated_microsteps.xliff"

# Consolidate with custom languages (English to French)
node json-consolidation-to-xliff.js "source_en.json" "target_fr.json" "consolidated_en_fr.xliff" en fr

# Simple consolidation with defaults
node json-consolidation-to-xliff.js source.json target.json output.xliff
```

**Key Features:**
- Matches source and target content by UUID
- Creates separate translation units for title and body fields
- Generates XLIFF 1.2 format with proper source/target structure
- Includes UUID-based notes for better organization
- Validates that both files have matching UUID structure

## 📁 File Structure

The project follows this organized directory structure:

```
json_n_xliff/
├── json_to_xliff/                    # JSON source files and XLIFF output
│   ├── 20250830 Korean Microsteps_Source.json
│   ├── 20250830_English_microsteps.xliff
│   └── [other generated XLIFF files]
├── xliff_to_json/                    # XLIFF source files and JSON output
│   ├── [translated XLIFF files]
│   └── [converted JSON files]
├── json-consolidation-to-xliff/      # Source/target JSON files and consolidated XLIFF
│   ├── 20250830 Korean Microsteps_Source.json
│   ├── 20250830 Korean Microsteps_Target.json
│   ├── consolidated_microsteps.xliff
│   └── [other consolidated files]
├── json-to-xliff.js                  # JSON → XLIFF converter script
├── xliff-to-json.js                  # XLIFF → JSON converter script
├── json-consolidation-to-xliff.js    # JSON consolidation → XLIFF script
├── package.json                      # Node.js project configuration
├── package-lock.json                 # Dependency lock file
├── node_modules/                     # Installed dependencies
├── README.md                         # This documentation
├── LICENSE                           # Project license
└── .gitignore                        # Git ignore rules
```

## 📝 Data Format Specifications

### JSON Input Format

The scripts expect JSON files with this structure:

```json
[
  {
    "title": "Focus on the rising and falling of your breath for 10 seconds.",
    "body": "Conscious breathing, even for a few moments, can activate your parasympathetic nervous system and bring you a deep sense of calm.",
    "uuid": "973fcb7a-154a-46f7-b7c6-134a16a46ea3"
  },
  {
    "title": "When your inner critic flares up, pause and repeat a positive affirmation.",
    "body": "Positive affirmations have been shown to reduce stress and help reduce patterns of negative thinking.",
    "uuid": "36ddfcee-a654-4e6d-8dd2-7761f3b3c005"
  }
]
```

**Required fields:**
- `title` - Main text/headline content
- `body` - Detailed description or content
- `uuid` - Unique identifier for tracking (36-character UUID format)

### XLIFF Output Format

**Standard XLIFF Files (json-to-xliff.js)** follow XLIFF 2.0 standard:

```xml
<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en" trgLang="ko">
  <file id="v1.0.0" original="source.json">
    <unit id="973fcb7a-154a-46f7-b7c6-134a16a46ea3_title">
      <segment>
        <source>Focus on the rising and falling of your breath for 10 seconds.</source>
        <target></target>
      </segment>
    </unit>
    <unit id="973fcb7a-154a-46f7-b7c6-134a16a46ea3_body">
      <segment>
        <source>Conscious breathing, even for a few moments...</source>
        <target></target>
      </segment>
    </unit>
  </file>
</xliff>
```

**Consolidated XLIFF Files (json-consolidation-to-xliff.js)** follow XLIFF 1.2 standard:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file original="consolidated_microsteps" source-language="en" target-language="ko" datatype="plaintext">
    <header>
      <tool tool-id="json-consolidation-to-xliff" tool-name="JSON Consolidation to XLIFF Converter" tool-version="1.0.0"/>
    </header>
    <body>
      <trans-unit id="973fcb7a-154a-46f7-b7c6-134a16a46ea3_title">
        <source>Focus on the rising and falling of your breath for 10 seconds.</source>
        <target>숨이 오르내리는 것에 10초 동안 집중하세요.</target>
        <note>Title for UUID: 973fcb7a-154a-46f7-b7c6-134a16a46ea3</note>
      </trans-unit>
      <trans-unit id="973fcb7a-154a-46f7-b7c6-134a16a46ea3_body">
        <source>Conscious breathing, even for a few moments...</source>
        <target>잠깐 동안이라도 의식적으로 호흡을 하면...</target>
        <note>Body for UUID: 973fcb7a-154a-46f7-b7c6-134a16a46ea3</note>
      </trans-unit>
    </body>
  </file>
</xliff>
```

## 🔧 Technical Implementation

### How It Works

1. **JSON to XLIFF Process:**
   - Reads and validates JSON array structure
   - Transforms to flat key-value pairs using UUID-based keys
   - Creates temporary source and target JSON files
   - Uses `@leading-works/json2xliff` CLI for conversion
   - Moves generated XLIFF file to specified location
   - Cleans up temporary files

2. **XLIFF to JSON Process:**
   - Reads XLIFF file content
   - Uses CLI to convert XLIFF back to flat JSON structure
   - Reconstructs original array format by grouping UUID-based keys
   - Maintains title/body associations through UUID matching
   - Outputs properly formatted JSON array

3. **JSON Consolidation Process:**
   - Reads both source and target JSON files simultaneously
   - Creates UUID-based mapping between source and target content
   - Generates XLIFF 1.2 format with proper source/target structure
   - Includes XML escaping for special characters
   - Validates UUID matching between files

4. **Key Technical Decisions:**
   - UUID-based key generation for reliable tracking
   - Temporary file management for CLI integration
   - Error handling for file operations and CLI execution
   - Automatic cleanup of intermediate files
   - Direct XLIFF generation for consolidation (no external dependencies)

### Dependencies

- **@leading-works/json2xliff**: Core conversion engine (used by json-to-xliff.js and xliff-to-json.js)
- **Node.js built-ins**: fs, path, child_process for file operations
- **No external dependencies**: json-consolidation-to-xliff.js uses only Node.js built-ins

## 🌍 Translation Workflow

### Complete Translation Process

1. **Prepare Source Content:**
   ```bash
   # Place your JSON file in json_to_xliff/ directory
   cp source_content.json json_to_xliff/
   ```

2. **Convert to XLIFF:**
   ```bash
   node json-to-xliff.js "json_to_xliff/source_content.json" "json_to_xliff/for_translation.xliff" en es
   ```

3. **Send for Translation:**
   - Send the XLIFF file to translators
   - Or import into CAT tools like Trados Studio, MemoQ, Phrase, etc.

4. **Receive Translated Content:**
   ```bash
   # Place translated XLIFF in xliff_to_json/ directory
   cp translated_content.xliff xliff_to_json/
   ```

5. **Convert Back to JSON:**
   ```bash
   node xliff-to-json.js "xliff_to_json/translated_content.xliff" "xliff_to_json/final_output.json" en es
   ```

### Consolidation Workflow

If you already have both source and target translations in JSON format:

1. **Prepare Source and Target Files:**
   ```bash
   # Place both JSON files in json-consolidation-to-xliff/ directory
   cp source_english.json json-consolidation-to-xliff/
   cp target_korean.json json-consolidation-to-xliff/
   ```

2. **Create Consolidated XLIFF:**
   ```bash
   node json-consolidation-to-xliff.js "json-consolidation-to-xliff/source_english.json" "json-consolidation-to-xliff/target_korean.json" "json-consolidation-to-xliff/consolidated.xliff" en ko
   ```

3. **Use for Review or Further Processing:**
   - Import consolidated XLIFF into translation management systems
   - Use for quality assurance and review workflows
   - Export to other formats as needed

### Supported CAT Tools

The generated XLIFF files are compatible with:
- **SDL Trados Studio**
- **MemoQ**
- **Phrase (Lokalise)**
- **Wordfast**
- **OmegaT**
- **MateCat**
- **Smartcat**
- And other XLIFF 2.0 compatible tools

## 📊 Project Statistics

### Successfully Tested With:

**Standard JSON to XLIFF Conversion:**
- **Source file**: `20250830 Korean Microsteps_Source.json` (398KB, 6,467 lines)
- **Conversion result**: 1,293 items → 2,586 translation units
- **Output**: `20250830_English_microsteps.xliff` (568KB, 6 lines - minified XML)
- **Languages tested**: English (en) → Korean (ko)
- **Round-trip conversion**: ✅ Successfully maintains data integrity

**JSON Consolidation to XLIFF:**
- **Source file**: `20250830 Korean Microsteps_Source.json` (398KB, 6,467 lines)
- **Target file**: `20250830 Korean Microsteps_Target.json` (474KB, 6,467 lines)
- **Consolidation result**: 1,293 items → 2,586 translation units with source/target pairs
- **Output**: `consolidated_microsteps.xliff` (1.1MB, 12,945 lines)
- **Languages tested**: English (en) → Korean (ko)
- **UUID matching**: ✅ Perfect 1:1 correspondence between source and target files

## 🚨 Error Handling

The scripts include comprehensive error handling for:

- **Missing input files**: Clear error messages with file path validation
- **Invalid JSON format**: JSON parsing error detection and reporting
- **Incorrect arguments**: Usage help display for invalid command-line arguments
- **File system issues**: Permission errors and directory creation handling
- **CLI execution errors**: Proper error propagation from the conversion library
- **Malformed XLIFF**: XLIFF parsing and structure validation

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **"Module not found" errors:**
   ```bash
   npm install
   ```

2. **Permission denied errors:**
   ```bash
   chmod +x json-to-xliff.js xliff-to-json.js json-consolidation-to-xliff.js
   ```

3. **File not found errors:**
   - Verify input file paths are correct
   - Check file exists and is readable
   - Use absolute paths if relative paths fail

4. **Invalid JSON errors:**
   - Validate JSON structure matches expected format
   - Ensure all objects have title, body, and uuid fields
   - Use JSON validator tools for syntax checking

5. **XLIFF conversion errors:**
   - Check XLIFF file is valid XML
   - Ensure XLIFF follows version 2.0 standard
   - Verify language codes are valid BCP-47 tags

### Debug Mode

For additional debugging information, you can:
- Check generated temporary files in the package directory
- Examine CLI output for detailed error messages
- Verify file permissions and directory structure

## 🤝 Contributing

This project was built as a specialized tool for JSON to XLIFF conversion workflows. If you need to extend functionality:

1. Fork the repository
2. Make your changes
3. Test with your specific use cases
4. Submit a pull request

## 📄 License

MIT License - feel free to use and modify as needed for your translation workflows.

## 📞 Support

If you encounter issues:
1. Check that all dependencies are installed (`npm install`)
2. Verify file paths and permissions are correct
3. Ensure input files match the expected format
4. Review error messages for specific guidance

---

**Built with ❤️ for translation teams who need reliable JSON ↔ XLIFF conversion.**
