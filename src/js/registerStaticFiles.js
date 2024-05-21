import fs from 'fs';

// Function to register binary files in the virtual filesystem
function registerBinaryFiles(ctx) {
  ctx.keys().forEach(key => {
    // Remove the leading "./" from the key
    const filePath = key.substring(2);
    const fileContent = ctx(key);

    // Write the file content to the virtual filesystem
    fs.writeFileSync(filePath, fileContent);
  });
}

// Function to register AFM font files in the virtual filesystem
function registerAFMFonts(ctx) {
  ctx.keys().forEach(key => {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      const fontPath = `data/${match[0]}`;
      const fontContent = ctx(key);

      // Write the font content to the virtual filesystem
      fs.writeFileSync(fontPath, fontContent);
    }
  });
}

// Register all files found in the "includes" folder (relative to src)
registerBinaryFiles(require.context('../includes', true));

// Register AFM fonts distributed with pdfkit
// It's a good practice to register only required fonts to avoid increasing the bundle size too much
registerAFMFonts(require.context('../path/to/afm/fonts', true, /\.afm$/));

// Ensure that required AFM fonts are correctly registered
