# Build Resources

This directory contains resources needed for building platform-specific executables.

## Icons

For proper application packaging, you should add the following icon files:

- `icon.icns` - macOS icon (512x512 or higher)
- `icon.ico` - Windows icon (256x256 with multiple sizes)
- `icon.png` - Linux icon (512x512 PNG)

## Icon Requirements

### macOS (.icns)
- 512x512 pixels minimum
- High DPI support recommended
- Use tools like `iconutil` or online converters

### Windows (.ico)
- Multiple sizes: 16x16, 32x32, 48x48, 256x256
- Use tools like IcoFX or online converters

### Linux (.png)
- 512x512 pixels
- PNG format with transparency support

## Creating Icons

You can create icons from a source image using online tools or:

1. **Online converters**: CloudConvert, ConvertICO, etc.
2. **Command line tools**:
   ```bash
   # macOS
   iconutil -c icns icon.iconset
   
   # ImageMagick (cross-platform)
   convert icon.png -resize 256x256 icon.ico
   ```

## Temporary Placeholder

Currently using placeholder icons. Replace with actual Pingado-branded icons for production builds.
