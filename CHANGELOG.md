# Changelog

All notable changes to the FadeLine plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-27

### Added
- **Auto-scroll functionality:** Automatically scrolls to keep the current line centered in the editor
- **Scroll delay setting:** Configurable delay before auto-scrolling (100-2000ms)
- **Scroll smoothness setting:** Adjustable animation smoothness (0.1-1.0)
- **Enhanced visual feedback:** Improved focus line styling with accent border
- **Smart scroll detection:** Only scrolls when line is significantly off-center (>50px)
- **Smooth animation:** Cubic easing for natural scroll movement

### Features
- **Intelligent auto-scroll:** Maintains current line in center of viewport
- **Customizable timing:** Adjust scroll delay and animation duration
- **Performance optimized:** Debounced scroll events to prevent excessive updates
- **Visual enhancements:** Better focus line indication with accent border
- **Responsive design:** Improved settings UI for different screen sizes

### Technical
- Added smooth scroll animation with requestAnimationFrame
- Implemented debounced auto-scroll with configurable timeout
- Enhanced DOM manipulation for better performance
- Improved error handling for edge cases

## [1.0.0] - 2025-06-26

### Added
- Initial release of FadeLine plugin
- Focus-enhancing feature that fades all lines except the current one
- Customizable fade amount and radius settings
- Four preset configurations: Gentle, Balanced, Strong, and Ultra Focus
- Live preview in settings tab
- Real-time cursor tracking and effect updates
- Smooth transitions and visual feedback

### Features
- **Gradual fade effect:** Lines further from cursor become more faded
- **Active line highlighting:** Current line always remains fully visible
- **Customizable settings:** Adjust fade amount (0.1-0.9) and radius (1-6)
- **Preset configurations:** Quick setup for different focus styles
- **Live preview:** See settings changes in real-time
- **Performance optimized:** Efficient DOM manipulation and event handling

### Technical
- Built with TypeScript and Obsidian API
- Modular architecture with clean separation of concerns
- Comprehensive error handling and edge case management
- Cross-platform compatibility (Windows, macOS, Linux)

---

## [Unreleased]

### Planned
- Additional focus modes
- Keyboard shortcuts for quick settings changes
- Integration with other Obsidian plugins
- Advanced customization options 