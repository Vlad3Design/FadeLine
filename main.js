/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// main.ts
__export(exports, {
  default: () => FadeLinePlugin
});
var import_obsidian = __toModule(require("obsidian"));
var FADE_PRESETS = [
  { name: "Gentle", fadeAmount: 0.4, fadeRadius: 2 },
  { name: "Balanced", fadeAmount: 0.1, fadeRadius: 4 },
  { name: "Strong", fadeAmount: 0.2, fadeRadius: 6 },
  { name: "Ultra Focus", fadeAmount: 0.05, fadeRadius: 6 }
];
var AUTO_SCROLL_PRESETS = [
  {
    name: "Instant",
    description: "Immediate scroll with no delay",
    autoScroll: true,
    autoScrollDelay: 0,
    autoScrollSmoothness: 0.1
  },
  {
    name: "Responsive",
    description: "Quick response for active writing",
    autoScroll: true,
    autoScrollDelay: 100,
    autoScrollSmoothness: 0.2
  },
  {
    name: "Smooth",
    description: "Balanced delay with smooth animation",
    autoScroll: true,
    autoScrollDelay: 300,
    autoScrollSmoothness: 0.4
  },
  {
    name: "Relaxed",
    description: "Gentle scroll for reading and editing",
    autoScroll: true,
    autoScrollDelay: 600,
    autoScrollSmoothness: 0.6
  },
  {
    name: "Presentation",
    description: "Slow, deliberate scroll for presentations",
    autoScroll: true,
    autoScrollDelay: 1e3,
    autoScrollSmoothness: 0.8
  },
  {
    name: "Disabled",
    description: "Auto-scroll turned off",
    autoScroll: false,
    autoScrollDelay: 500,
    autoScrollSmoothness: 0.3
  }
];
var COMBINED_PRESETS = [
  {
    name: "Writing Mode",
    description: "Optimized for active writing",
    enableFade: true,
    fadeAmount: 0.1,
    fadeRadius: 4,
    autoScroll: true,
    autoScrollDelay: 200,
    autoScrollSmoothness: 0.3
  },
  {
    name: "Reading Mode",
    description: "Gentle focus for reading",
    enableFade: true,
    fadeAmount: 0.3,
    fadeRadius: 3,
    autoScroll: true,
    autoScrollDelay: 800,
    autoScrollSmoothness: 0.5
  },
  {
    name: "Coding Mode",
    description: "Sharp focus for code editing",
    enableFade: true,
    fadeAmount: 0.05,
    fadeRadius: 6,
    autoScroll: true,
    autoScrollDelay: 150,
    autoScrollSmoothness: 0.2
  },
  {
    name: "Focus Mode",
    description: "Balanced fade with instant scroll response",
    enableFade: true,
    fadeAmount: 0.1,
    fadeRadius: 4,
    autoScroll: true,
    autoScrollDelay: 0,
    autoScrollSmoothness: 0.1
  },
  {
    name: "Presentation Mode",
    description: "Slow, deliberate for presentations",
    enableFade: true,
    fadeAmount: 0.2,
    fadeRadius: 2,
    autoScroll: true,
    autoScrollDelay: 1200,
    autoScrollSmoothness: 0.7
  },
  {
    name: "Minimal Mode",
    description: "Subtle effects, no auto-scroll",
    enableFade: true,
    fadeAmount: 0.6,
    fadeRadius: 2,
    autoScroll: false,
    autoScrollDelay: 500,
    autoScrollSmoothness: 0.3
  },
  {
    name: "No Fade Mode",
    description: "Auto-scroll only, no fade effects",
    enableFade: false,
    fadeAmount: 0.1,
    fadeRadius: 4,
    autoScroll: true,
    autoScrollDelay: 200,
    autoScrollSmoothness: 0.3
  }
];
var DEFAULT_SETTINGS = {
  enableFade: true,
  fadeAmount: 0.1,
  fadeRadius: 4,
  autoScroll: true,
  autoScrollDelay: 0,
  autoScrollSmoothness: 0.1
};
var FadeLinePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.activeEditor = null;
    this.autoScrollTimeout = null;
    this.cursorChangeTimeout = null;
  }
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
    if (this.settings.enableFade) {
      document.body.classList.remove("fadeline-no-fade");
    } else {
      document.body.classList.add("fadeline-no-fade");
    }
  }
  addBodyClass() {
    document.body.classList.add("fadeline-enabled");
    this.updateCSSVars();
  }
  removeBodyClass() {
    document.body.classList.remove("fadeline-enabled");
    document.body.classList.remove("fadeline-no-fade");
  }
  getOpacityClassName(opacity) {
    if (opacity >= 1)
      return "fadeline-opacity-1";
    if (opacity <= 0)
      return "fadeline-opacity-0";
    const rounded = Math.round(opacity * 20) / 20;
    const classValue = rounded.toString().replace(".", "");
    return `fadeline-opacity-${classValue}`;
  }
  removeOpacityClasses(element) {
    const classes = element.className.split(" ").filter((cls) => !cls.startsWith("fadeline-opacity-"));
    element.className = classes.join(" ");
  }
  getEditorContainer(editor) {
    const editorWithContainer = editor;
    return editorWithContainer.containerEl || null;
  }
  registerEvents() {
    this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.onActiveLeafChange()));
    this.registerEvent(this.app.workspace.on("editor-change", () => this.updateFocusEffect()));
    this.registerEvent(this.app.workspace.on("layout-change", () => {
      this.setupEditorClickListeners();
    }));
    this.registerEvent(this.app.workspace.on("editor-change", () => {
      this.handleCursorChange();
    }));
    setTimeout(() => this.setupEditorClickListeners(), 100);
  }
  setupEditorClickListeners() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view)
      return;
    const editor = view.editor;
    const editorEl = this.getEditorContainer(editor);
    if (!editorEl)
      return;
    const boundClickHandler = this.handleEditorClick.bind(this);
    editorEl.removeEventListener("click", boundClickHandler);
    editorEl.removeEventListener("click", this.handleEditorClick);
    editorEl.addEventListener("click", boundClickHandler);
    editorEl.__fadelineClickHandler = boundClickHandler;
  }
  handleEditorClick() {
    setTimeout(() => {
      this.updateFocusEffect();
    }, 10);
  }
  handleCursorChange() {
    if (this.cursorChangeTimeout) {
      clearTimeout(this.cursorChangeTimeout);
    }
    this.cursorChangeTimeout = setTimeout(() => {
      this.updateFocusEffect();
    }, 50);
  }
  onActiveLeafChange() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    this.activeEditor = view ? view.editor : null;
    this.updateFocusEffect();
  }
  updateFocusEffect() {
    if (!this.activeEditor)
      return;
    const editor = this.activeEditor;
    const editorEl = this.getEditorContainer(editor);
    if (!editorEl)
      return;
    const lines = editorEl.querySelectorAll(".cm-line");
    if (lines.length === 0)
      return;
    const cursorLine = editor.getCursor().line;
    lines.forEach((line, idx) => {
      const el = line;
      this.removeOpacityClasses(el);
      el.classList.remove("fadeline-current");
      if (this.settings.enableFade) {
        const isCurrentLineByIndex = idx === cursorLine;
        let isCurrentLineByContent = false;
        try {
          const cursorPos = editor.getCursor();
          const currentLineElement = editor.getLine(cursorPos.line);
          const lineText = el.textContent || "";
          isCurrentLineByContent = lineText === currentLineElement;
        } catch (e) {
          isCurrentLineByContent = isCurrentLineByIndex;
        }
        const isCurrentLine = isCurrentLineByIndex || isCurrentLineByContent;
        if (isCurrentLine) {
          el.classList.add("fadeline-current");
        } else {
          const radius = this.settings.fadeRadius;
          const minFade = this.settings.fadeAmount;
          const dist = Math.abs(idx - cursorLine);
          if (dist <= radius) {
            const fade = minFade + (1 - minFade) * (1 - dist / (radius + 1));
            el.classList.add(this.getOpacityClassName(fade));
          } else {
            el.classList.add(this.getOpacityClassName(minFade));
          }
        }
      } else {
        el.classList.add("fadeline-opacity-1");
      }
    });
    if (this.settings.autoScroll) {
      this.scheduleAutoScroll(cursorLine);
    }
  }
  scheduleAutoScroll(cursorLine) {
    if (this.autoScrollTimeout) {
      clearTimeout(this.autoScrollTimeout);
    }
    this.autoScrollTimeout = setTimeout(() => {
      this.performAutoScroll(cursorLine);
    }, this.settings.autoScrollDelay);
  }
  performAutoScroll(cursorLine) {
    if (!this.activeEditor)
      return;
    const editor = this.activeEditor;
    const editorEl = this.getEditorContainer(editor);
    if (!editorEl)
      return;
    const lines = editorEl.querySelectorAll(".cm-line");
    const currentLineEl = lines[cursorLine];
    if (!currentLineEl)
      return;
    const editorContainer = editorEl.querySelector(".cm-scroller");
    if (!editorContainer)
      return;
    const containerRect = editorContainer.getBoundingClientRect();
    const lineRect = currentLineEl.getBoundingClientRect();
    const lineTop = lineRect.top - containerRect.top;
    const lineBottom = lineRect.bottom - containerRect.top;
    const containerHeight = containerRect.height;
    const centerOffset = containerHeight / 2;
    const lineCenter = (lineTop + lineBottom) / 2;
    const distanceFromCenter = Math.abs(lineCenter - centerOffset);
    if (distanceFromCenter > 50) {
      const scrollAmount = lineCenter - centerOffset;
      const currentScrollTop = editorContainer.scrollTop;
      const targetScrollTop = currentScrollTop + scrollAmount;
      this.smoothScrollTo(editorContainer, targetScrollTop, this.settings.autoScrollSmoothness);
    }
  }
  smoothScrollTo(element, targetScrollTop, duration) {
    const startScrollTop = element.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1e3), 1);
      const easedProgress = easeOutCubic(progress);
      element.scrollTop = startScrollTop + distance * easedProgress;
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    requestAnimationFrame(animateScroll);
  }
  clearFocusEffect() {
    const editor = this.activeEditor;
    if (!editor)
      return;
    const editorEl = this.getEditorContainer(editor);
    if (!editorEl)
      return;
    const lines = editorEl.querySelectorAll(".cm-line");
    lines.forEach((line) => {
      const el = line;
      this.removeOpacityClasses(el);
      el.classList.remove("fadeline-current");
    });
  }
};
var FadeLineSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "FadeLine Settings" });
    containerEl.createEl("h3", { text: "Quick Presets" });
    new import_obsidian.Setting(containerEl).setName("Use Case Presets").setDesc("Choose a preset optimized for your current activity").addDropdown((drop) => {
      COMBINED_PRESETS.forEach((preset, idx) => {
        drop.addOption(idx.toString(), preset.name);
      });
      drop.setValue(COMBINED_PRESETS.findIndex((p) => p.enableFade === this.plugin.settings.enableFade && p.fadeAmount === this.plugin.settings.fadeAmount && p.fadeRadius === this.plugin.settings.fadeRadius && p.autoScroll === this.plugin.settings.autoScroll && p.autoScrollDelay === this.plugin.settings.autoScrollDelay && p.autoScrollSmoothness === this.plugin.settings.autoScrollSmoothness).toString());
      drop.onChange(async (val) => {
        const preset = COMBINED_PRESETS[parseInt(val)];
        this.plugin.settings.enableFade = preset.enableFade;
        this.plugin.settings.fadeAmount = preset.fadeAmount;
        this.plugin.settings.fadeRadius = preset.fadeRadius;
        this.plugin.settings.autoScroll = preset.autoScroll;
        this.plugin.settings.autoScrollDelay = preset.autoScrollDelay;
        this.plugin.settings.autoScrollSmoothness = preset.autoScrollSmoothness;
        await this.plugin.saveSettings();
        this.display();
      });
    });
    containerEl.createEl("h3", { text: "Fade Settings" });
    new import_obsidian.Setting(containerEl).setName("Enable Fade Effects").setDesc("Toggle fade effects on/off. When disabled, only the current line will be highlighted.").addToggle((toggle) => toggle.setValue(this.plugin.settings.enableFade).onChange(async (value) => {
      this.plugin.settings.enableFade = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.enableFade) {
      new import_obsidian.Setting(containerEl).setName("Fade Presets").setDesc("Quickly choose a fade effect").addDropdown((drop) => {
        FADE_PRESETS.forEach((preset, idx) => {
          drop.addOption(idx.toString(), preset.name);
        });
        drop.setValue(FADE_PRESETS.findIndex((p) => p.fadeAmount === this.plugin.settings.fadeAmount && p.fadeRadius === this.plugin.settings.fadeRadius).toString());
        drop.onChange(async (val) => {
          const preset = FADE_PRESETS[parseInt(val)];
          this.plugin.settings.fadeAmount = preset.fadeAmount;
          this.plugin.settings.fadeRadius = preset.fadeRadius;
          await this.plugin.saveSettings();
          this.display();
        });
      });
      new import_obsidian.Setting(containerEl).setName("Fade Amount").setDesc("Minimum opacity for distant lines (0.1 = very faded, 0.9 = almost visible)").addSlider((slider) => slider.setLimits(0.1, 0.9, 0.01).setValue(this.plugin.settings.fadeAmount).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.fadeAmount = value;
        await this.plugin.saveSettings();
        this.display();
      }));
      new import_obsidian.Setting(containerEl).setName("Fade Radius").setDesc("How many lines around the active one should be gradually faded (1-6)").addSlider((slider) => slider.setLimits(1, 6, 1).setValue(this.plugin.settings.fadeRadius).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.fadeRadius = value;
        await this.plugin.saveSettings();
        this.display();
      }));
    }
    containerEl.createEl("h3", { text: "Auto-Scroll Settings" });
    new import_obsidian.Setting(containerEl).setName("Enable Auto-Scroll").setDesc("Automatically scroll to keep the current line centered in the editor").addToggle((toggle) => toggle.setValue(this.plugin.settings.autoScroll).onChange(async (value) => {
      this.plugin.settings.autoScroll = value;
      await this.plugin.saveSettings();
      this.display();
    }));
    if (this.plugin.settings.autoScroll) {
      new import_obsidian.Setting(containerEl).setName("Auto-Scroll Presets").setDesc("Choose a scroll behavior preset").addDropdown((drop) => {
        AUTO_SCROLL_PRESETS.forEach((preset, idx) => {
          drop.addOption(idx.toString(), preset.name);
        });
        drop.setValue(AUTO_SCROLL_PRESETS.findIndex((p) => p.autoScroll === this.plugin.settings.autoScroll && p.autoScrollDelay === this.plugin.settings.autoScrollDelay && p.autoScrollSmoothness === this.plugin.settings.autoScrollSmoothness).toString());
        drop.onChange(async (val) => {
          const preset = AUTO_SCROLL_PRESETS[parseInt(val)];
          this.plugin.settings.autoScroll = preset.autoScroll;
          this.plugin.settings.autoScrollDelay = preset.autoScrollDelay;
          this.plugin.settings.autoScrollSmoothness = preset.autoScrollSmoothness;
          await this.plugin.saveSettings();
          this.display();
        });
      });
      new import_obsidian.Setting(containerEl).setName("Scroll Delay").setDesc(`Delay before auto-scrolling (${this.plugin.settings.autoScrollDelay}ms)`).addSlider((slider) => slider.setLimits(0, 2e3, 50).setValue(this.plugin.settings.autoScrollDelay).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.autoScrollDelay = value;
        await this.plugin.saveSettings();
        this.display();
      }));
      new import_obsidian.Setting(containerEl).setName("Scroll Smoothness").setDesc(`Animation smoothness (${this.plugin.settings.autoScrollSmoothness})`).addSlider((slider) => slider.setLimits(0.1, 1, 0.05).setValue(this.plugin.settings.autoScrollSmoothness).setDynamicTooltip().onChange(async (value) => {
        this.plugin.settings.autoScrollSmoothness = value;
        await this.plugin.saveSettings();
        this.display();
      }));
    }
    containerEl.createEl("h3", { text: "Preview" });
    const preview = containerEl.createDiv("fadeline-preview");
    if (this.plugin.settings.autoScroll) {
      const scrollInfo = preview.createDiv("fadeline-scroll-info");
      const infoDiv = scrollInfo.createDiv();
      infoDiv.style.marginBottom = "8px";
      infoDiv.style.padding = "8px";
      infoDiv.style.background = "var(--background-modifier-hover)";
      infoDiv.style.borderRadius = "4px";
      infoDiv.style.fontSize = "12px";
      const strong = infoDiv.createEl("strong");
      strong.textContent = "Auto-Scroll Active:";
      infoDiv.appendText(` ${this.plugin.settings.autoScrollDelay}ms delay, ${this.plugin.settings.autoScrollSmoothness} smoothness`);
    }
    if (this.plugin.settings.enableFade) {
      const radius = this.plugin.settings.fadeRadius;
      const minFade = this.plugin.settings.fadeAmount;
      for (let i = -radius - 1; i <= radius + 1; i++) {
        const previewLine = preview.createDiv("fadeline-preview-line");
        if (i === 0) {
          previewLine.addClass("fadeline-preview-current");
          previewLine.textContent = "\u2190 This is your current line (focused)";
        } else if (Math.abs(i) <= radius) {
          const fade = minFade + (1 - minFade) * (1 - Math.abs(i) / (radius + 1));
          previewLine.style.opacity = fade.toFixed(3);
          previewLine.textContent = "This line is near focus";
        } else {
          previewLine.style.opacity = minFade.toString();
          previewLine.textContent = "This line is dimmed";
        }
      }
    } else {
      const currentLine = preview.createDiv("fadeline-preview-line fadeline-preview-current");
      currentLine.textContent = "\u2190 This is your current line";
      for (let i = 0; i < 4; i++) {
        const notFocusedLine = preview.createDiv("fadeline-preview-line");
        notFocusedLine.style.opacity = "0.7";
        notFocusedLine.textContent = "This line is not focused";
      }
    }
  }
};
