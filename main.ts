/**
 * FadeLine - Obsidian Plugin
 * 
 * A focus-enhancing plugin that fades all lines except the current one,
 * helping you concentrate while maintaining context.
 * 
 * @author Vlad 3Design
 * @version 1.0.0
 */

import { App, Plugin, PluginSettingTab, Setting, Editor, MarkdownView } from 'obsidian';

interface FadeLineSettings {
  fadeAmount: number;
  fadeRadius: number;
  autoScroll: boolean;
  autoScrollDelay: number;
  autoScrollSmoothness: number;
}

// Fade presets
const FADE_PRESETS = [
  { name: 'Gentle', fadeAmount: 0.4, fadeRadius: 2 },
  { name: 'Balanced', fadeAmount: 0.1, fadeRadius: 4 },
  { name: 'Strong', fadeAmount: 0.2, fadeRadius: 6 },
  { name: 'Ultra Focus', fadeAmount: 0.05, fadeRadius: 6 },
];

// Auto-scroll presets
const AUTO_SCROLL_PRESETS = [
  { 
    name: 'Instant', 
    description: 'Immediate scroll with no delay',
    autoScroll: true,
    autoScrollDelay: 0,
    autoScrollSmoothness: 0.1
  },
  { 
    name: 'Responsive', 
    description: 'Quick response for active writing',
    autoScroll: true,
    autoScrollDelay: 100,
    autoScrollSmoothness: 0.2
  },
  { 
    name: 'Smooth', 
    description: 'Balanced delay with smooth animation',
    autoScroll: true,
    autoScrollDelay: 300,
    autoScrollSmoothness: 0.4
  },
  { 
    name: 'Relaxed', 
    description: 'Gentle scroll for reading and editing',
    autoScroll: true,
    autoScrollDelay: 600,
    autoScrollSmoothness: 0.6
  },
  { 
    name: 'Presentation', 
    description: 'Slow, deliberate scroll for presentations',
    autoScroll: true,
    autoScrollDelay: 1000,
    autoScrollSmoothness: 0.8
  },
  { 
    name: 'Disabled', 
    description: 'Auto-scroll turned off',
    autoScroll: false,
    autoScrollDelay: 500,
    autoScrollSmoothness: 0.3
  }
];

// Combined presets for different use cases
const COMBINED_PRESETS = [
  {
    name: 'Writing Mode',
    description: 'Optimized for active writing',
    fadeAmount: 0.1,
    fadeRadius: 4,
    autoScroll: true,
    autoScrollDelay: 200,
    autoScrollSmoothness: 0.3
  },
  {
    name: 'Reading Mode',
    description: 'Gentle focus for reading',
    fadeAmount: 0.3,
    fadeRadius: 3,
    autoScroll: true,
    autoScrollDelay: 800,
    autoScrollSmoothness: 0.5
  },
  {
    name: 'Coding Mode',
    description: 'Sharp focus for code editing',
    fadeAmount: 0.05,
    fadeRadius: 6,
    autoScroll: true,
    autoScrollDelay: 150,
    autoScrollSmoothness: 0.2
  },
  {
    name: 'Focus Mode',
    description: 'Balanced fade with instant scroll response',
    fadeAmount: 0.1,
    fadeRadius: 4,
    autoScroll: true,
    autoScrollDelay: 0,
    autoScrollSmoothness: 0.1
  },
  {
    name: 'Presentation Mode',
    description: 'Slow, deliberate for presentations',
    fadeAmount: 0.2,
    fadeRadius: 2,
    autoScroll: true,
    autoScrollDelay: 1200,
    autoScrollSmoothness: 0.7
  },
  {
    name: 'Minimal Mode',
    description: 'Subtle effects, no auto-scroll',
    fadeAmount: 0.6,
    fadeRadius: 2,
    autoScroll: false,
    autoScrollDelay: 500,
    autoScrollSmoothness: 0.3
  }
];

const DEFAULT_SETTINGS: FadeLineSettings = {
  fadeAmount: 0.1,
  fadeRadius: 4,
  autoScroll: true,
  autoScrollDelay: 0,
  autoScrollSmoothness: 0.1,
};

export default class FadeLinePlugin extends Plugin {
  settings!: FadeLineSettings;
  activeEditor: Editor | null = null;
  autoScrollTimeout: NodeJS.Timeout | null = null;
  cursorChangeTimeout: NodeJS.Timeout | null = null;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new FadeLineSettingTab(this.app, this));
    this.registerEvents();
    this.addBodyClass();
    setTimeout(() => this.updateFocusEffect(), 100);
  }

  onunload() {
    this.removeBodyClass();
    this.clearFocusEffect();
    if (this.autoScrollTimeout) {
      clearTimeout(this.autoScrollTimeout);
    }
    if (this.cursorChangeTimeout) {
      clearTimeout(this.cursorChangeTimeout);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.updateCSSVars();
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.updateCSSVars();
    this.updateFocusEffect();
  }

  updateCSSVars() {
    document.documentElement.style.setProperty('--fadeline-fade-amount', this.settings.fadeAmount.toString());
    document.documentElement.style.setProperty('--fadeline-fade-radius', this.settings.fadeRadius.toString());
  }

  addBodyClass() {
    document.body.classList.add('fadeline-enabled');
  }

  removeBodyClass() {
    document.body.classList.remove('fadeline-enabled');
  }

  registerEvents() {
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.onActiveLeafChange()));
    this.registerEvent(this.app.workspace.on('editor-change', () => this.updateFocusEffect()));
    
    // Add click event listener for editor clicks
    this.registerEvent(this.app.workspace.on('layout-change', () => {
      this.setupEditorClickListeners();
    }));
    
    // Add cursor position change detection
    this.registerEvent(this.app.workspace.on('editor-change', () => {
      this.handleCursorChange();
    }));
    
    // Initial setup
    setTimeout(() => this.setupEditorClickListeners(), 100);
  }

  setupEditorClickListeners() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return;
    
    const editor = view.editor;
    const editorEl = (editor as any).containerEl;
    if (!editorEl) return;

    // Remove existing listeners to prevent duplicates
    editorEl.removeEventListener('click', this.handleEditorClick);
    
    // Add new click listener
    editorEl.addEventListener('click', this.handleEditorClick.bind(this));
  }

  handleEditorClick() {
    // Force update focus effect when clicking
    setTimeout(() => {
      this.updateFocusEffect();
    }, 10);
  }

  handleCursorChange() {
    // Debounced cursor change handler
    if (this.cursorChangeTimeout) {
      clearTimeout(this.cursorChangeTimeout);
    }
    
    this.cursorChangeTimeout = setTimeout(() => {
      this.updateFocusEffect();
    }, 50);
  }

  onActiveLeafChange() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    this.activeEditor = view ? view.editor : null;
    this.updateFocusEffect();
  }

  updateFocusEffect() {
    if (!this.activeEditor) return;
    const editor = this.activeEditor;
    const editorEl = (editor as any).containerEl;
    if (!editorEl) return;
    const lines = editorEl.querySelectorAll('.cm-line');
    const cursorLine = editor.getCursor().line;
    const radius = this.settings.fadeRadius;
    const minFade = this.settings.fadeAmount;
    lines.forEach((line: Element, idx: number) => {
      const el = line as HTMLElement;
      const dist = Math.abs(idx - cursorLine);
      if (dist === 0) {
        el.classList.add('fadeline-current');
        el.style.opacity = '1';
      } else if (dist <= radius) {
        const fade = minFade + (1 - minFade) * (1 - dist / (radius + 1));
        el.classList.remove('fadeline-current');
        el.style.opacity = fade.toFixed(3);
      } else {
        el.classList.remove('fadeline-current');
        el.style.opacity = minFade.toString();
      }
    });

    // Auto-scroll functionality
    if (this.settings.autoScroll) {
      this.scheduleAutoScroll(cursorLine);
    }
  }

  scheduleAutoScroll(cursorLine: number) {
    // Clear existing timeout
    if (this.autoScrollTimeout) {
      clearTimeout(this.autoScrollTimeout);
    }

    // Schedule new auto-scroll
    this.autoScrollTimeout = setTimeout(() => {
      this.performAutoScroll(cursorLine);
    }, this.settings.autoScrollDelay);
  }

  performAutoScroll(cursorLine: number) {
    if (!this.activeEditor) return;
    
    const editor = this.activeEditor;
    const editorEl = (editor as any).containerEl;
    if (!editorEl) return;

    // Get the current line element
    const lines = editorEl.querySelectorAll('.cm-line');
    const currentLineEl = lines[cursorLine] as HTMLElement;
    if (!currentLineEl) return;

    // Get editor container dimensions
    const editorContainer = editorEl.querySelector('.cm-scroller');
    if (!editorContainer) return;

    const containerRect = editorContainer.getBoundingClientRect();
    const lineRect = currentLineEl.getBoundingClientRect();

    // Calculate if line is outside the visible area
    const lineTop = lineRect.top - containerRect.top;
    const lineBottom = lineRect.bottom - containerRect.top;
    const containerHeight = containerRect.height;
    const centerOffset = containerHeight / 2;

    // Check if line needs to be centered
    const lineCenter = (lineTop + lineBottom) / 2;
    const distanceFromCenter = Math.abs(lineCenter - centerOffset);

    // Only scroll if line is significantly off-center (more than 50px)
    if (distanceFromCenter > 50) {
      const scrollAmount = lineCenter - centerOffset;
      const currentScrollTop = editorContainer.scrollTop;
      const targetScrollTop = currentScrollTop + scrollAmount;

      // Smooth scroll to target position
      this.smoothScrollTo(editorContainer, targetScrollTop, this.settings.autoScrollSmoothness);
    }
  }

  smoothScrollTo(element: HTMLElement, targetScrollTop: number, duration: number) {
    const startScrollTop = element.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = easeOutCubic(progress);

      element.scrollTop = startScrollTop + (distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }

  clearFocusEffect() {
    const editor = this.activeEditor;
    if (!editor) return;
    const editorEl = (editor as any).containerEl;
    if (!editorEl) return;
    const lines = editorEl.querySelectorAll('.cm-line');
    lines.forEach((line: Element) => {
      (line as HTMLElement).classList.remove('fadeline-current');
      (line as HTMLElement).style.opacity = '';
    });
  }
}

class FadeLineSettingTab extends PluginSettingTab {
  plugin: FadeLinePlugin;
  constructor(app: App, plugin: FadeLinePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'FadeLine Settings' });

    // Combined presets section
    containerEl.createEl('h3', { text: 'Quick Presets' });
    new Setting(containerEl)
      .setName('Use Case Presets')
      .setDesc('Choose a preset optimized for your current activity')
      .addDropdown(drop => {
        COMBINED_PRESETS.forEach((preset, idx) => {
          drop.addOption(idx.toString(), preset.name);
        });
        drop.setValue(COMBINED_PRESETS.findIndex(p => 
          p.fadeAmount === this.plugin.settings.fadeAmount && 
          p.fadeRadius === this.plugin.settings.fadeRadius &&
          p.autoScroll === this.plugin.settings.autoScroll &&
          p.autoScrollDelay === this.plugin.settings.autoScrollDelay &&
          p.autoScrollSmoothness === this.plugin.settings.autoScrollSmoothness
        ).toString());
        drop.onChange(async (val) => {
          const preset = COMBINED_PRESETS[parseInt(val)];
          this.plugin.settings.fadeAmount = preset.fadeAmount;
          this.plugin.settings.fadeRadius = preset.fadeRadius;
          this.plugin.settings.autoScroll = preset.autoScroll;
          this.plugin.settings.autoScrollDelay = preset.autoScrollDelay;
          this.plugin.settings.autoScrollSmoothness = preset.autoScrollSmoothness;
          await this.plugin.saveSettings();
          this.display();
        });
      });

    // Fade settings section
    containerEl.createEl('h3', { text: 'Fade Settings' });
    
    new Setting(containerEl)
      .setName('Fade Presets')
      .setDesc('Quickly choose a fade effect')
      .addDropdown(drop => {
        FADE_PRESETS.forEach((preset, idx) => {
          drop.addOption(idx.toString(), preset.name);
        });
        drop.setValue(FADE_PRESETS.findIndex(p => p.fadeAmount === this.plugin.settings.fadeAmount && p.fadeRadius === this.plugin.settings.fadeRadius).toString());
        drop.onChange(async (val) => {
          const preset = FADE_PRESETS[parseInt(val)];
          this.plugin.settings.fadeAmount = preset.fadeAmount;
          this.plugin.settings.fadeRadius = preset.fadeRadius;
          await this.plugin.saveSettings();
          this.display();
        });
      });

    new Setting(containerEl)
      .setName('Fade Amount')
      .setDesc('Minimum opacity for distant lines (0.1 = very faded, 0.9 = almost visible)')
      .addSlider(slider => slider
        .setLimits(0.1, 0.9, 0.01)
        .setValue(this.plugin.settings.fadeAmount)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.fadeAmount = value;
          await this.plugin.saveSettings();
          this.display();
        }));

    new Setting(containerEl)
      .setName('Fade Radius')
      .setDesc('How many lines around the active one should be gradually faded (1-6)')
      .addSlider(slider => slider
        .setLimits(1, 6, 1)
        .setValue(this.plugin.settings.fadeRadius)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.fadeRadius = value;
          await this.plugin.saveSettings();
          this.display();
        }));

    // Auto-scroll section
    containerEl.createEl('h3', { text: 'Auto-Scroll Settings' });

    new Setting(containerEl)
      .setName('Enable Auto-Scroll')
      .setDesc('Automatically scroll to keep the current line centered in the editor')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoScroll)
        .onChange(async (value) => {
          this.plugin.settings.autoScroll = value;
          await this.plugin.saveSettings();
          this.display();
        }));

    if (this.plugin.settings.autoScroll) {
      new Setting(containerEl)
        .setName('Auto-Scroll Presets')
        .setDesc('Choose a scroll behavior preset')
        .addDropdown(drop => {
          AUTO_SCROLL_PRESETS.forEach((preset, idx) => {
            drop.addOption(idx.toString(), preset.name);
          });
          drop.setValue(AUTO_SCROLL_PRESETS.findIndex(p => p.autoScroll === this.plugin.settings.autoScroll && p.autoScrollDelay === this.plugin.settings.autoScrollDelay && p.autoScrollSmoothness === this.plugin.settings.autoScrollSmoothness).toString());
          drop.onChange(async (val) => {
            const preset = AUTO_SCROLL_PRESETS[parseInt(val)];
            this.plugin.settings.autoScroll = preset.autoScroll;
            this.plugin.settings.autoScrollDelay = preset.autoScrollDelay;
            this.plugin.settings.autoScrollSmoothness = preset.autoScrollSmoothness;
            await this.plugin.saveSettings();
            this.display();
          });
        });

      new Setting(containerEl)
        .setName('Scroll Delay')
        .setDesc(`Delay before auto-scrolling (${this.plugin.settings.autoScrollDelay}ms)`)
        .addSlider(slider => slider
          .setLimits(0, 2000, 50)
          .setValue(this.plugin.settings.autoScrollDelay)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.autoScrollDelay = value;
            await this.plugin.saveSettings();
            this.display();
          }));

      new Setting(containerEl)
        .setName('Scroll Smoothness')
        .setDesc(`Animation smoothness (${this.plugin.settings.autoScrollSmoothness})`)
        .addSlider(slider => slider
          .setLimits(0.1, 1.0, 0.05)
          .setValue(this.plugin.settings.autoScrollSmoothness)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.autoScrollSmoothness = value;
            await this.plugin.saveSettings();
            this.display();
          }));
    }

    // Preview
    containerEl.createEl('h3', { text: 'Preview' });
    const preview = containerEl.createDiv('fadeline-preview');
    
    // Add auto-scroll info to preview
    if (this.plugin.settings.autoScroll) {
      const scrollInfo = preview.createDiv('fadeline-scroll-info');
      scrollInfo.innerHTML = `
        <div style="margin-bottom: 8px; padding: 8px; background: var(--background-modifier-hover); border-radius: 4px; font-size: 12px;">
          <strong>Auto-Scroll Active:</strong> ${this.plugin.settings.autoScrollDelay}ms delay, ${this.plugin.settings.autoScrollSmoothness} smoothness
        </div>
      `;
    }
    
    // Generate gradual preview
    const radius = this.plugin.settings.fadeRadius;
    const minFade = this.plugin.settings.fadeAmount;
    let html = '';
    for (let i = -radius - 1; i <= radius + 1; i++) {
      if (i === 0) {
        html += '<div class="fadeline-preview-line fadeline-preview-current">← This is your current line (focused)</div>';
      } else if (Math.abs(i) <= radius) {
        const fade = minFade + (1 - minFade) * (1 - Math.abs(i) / (radius + 1));
        html += `<div class=\"fadeline-preview-line\" style=\"opacity:${fade.toFixed(3)}\">This line is near focus</div>`;
      } else {
        html += `<div class=\"fadeline-preview-line\" style=\"opacity:${minFade}\">This line is dimmed</div>`;
      }
    }
    preview.innerHTML += html;
  }
} 