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
}

const PRESETS = [
  { name: 'Gentle', fadeAmount: 0.4, fadeRadius: 2 },
  { name: 'Balanced', fadeAmount: 0.1, fadeRadius: 4 },
  { name: 'Strong', fadeAmount: 0.2, fadeRadius: 6 },
  { name: 'Ultra Focus', fadeAmount: 0.05, fadeRadius: 6 },
];

const DEFAULT_SETTINGS: FadeLineSettings = {
  fadeAmount: 0.1,
  fadeRadius: 4,
};

export default class FadeLinePlugin extends Plugin {
  settings: FadeLineSettings;
  activeEditor: Editor | null = null;

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

    // Presets
    new Setting(containerEl)
      .setName('Presets')
      .setDesc('Quickly choose a fade effect')
      .addDropdown(drop => {
        PRESETS.forEach((preset, idx) => {
          drop.addOption(idx.toString(), preset.name);
        });
        drop.setValue(PRESETS.findIndex(p => p.fadeAmount === this.plugin.settings.fadeAmount && p.fadeRadius === this.plugin.settings.fadeRadius).toString());
        drop.onChange(async (val) => {
          const preset = PRESETS[parseInt(val)];
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
    // Preview
    containerEl.createEl('h3', { text: 'Preview' });
    const preview = containerEl.createDiv('fadeline-preview');
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
    preview.innerHTML = html;
  }
} 