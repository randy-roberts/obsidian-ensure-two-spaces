'use strict';

var obsidian = require('obsidian');

const DEFAULT_SETTINGS = {
    runOnSave: true,
    allowHotkey: true,
    hotkeyText: 'Ctrl+Alt+Space',
    excludeCodeBlocks: true,
    excludeFrontMatter: true
};

class EnsureTwoSpacesPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
    }
    
    async onload() {
        console.log('Loading Ensure Two Spaces plugin');
        
        await this.loadSettings();
        
        // Add command to manually add two spaces at the end of each line
        this.addCommand({
            id: 'ensure-two-spaces',
            name: 'Ensure all lines end with exactly two spaces',
            editorCallback: (editor, view) => {
                this.ensureTwoSpaces(editor);
            }
        });

        // Run on save if enabled
        if (this.settings.runOnSave) {
            this.registerEvent(
                this.app.workspace.on('editor-save', (editor) => {
                    if (editor instanceof obsidian.Editor) {
                        this.ensureTwoSpaces(editor);
                    }
                })
            );
        }

        // Add hotkey if enabled
        if (this.settings.allowHotkey) {
            this.addCommand({
                id: 'hotkey-ensure-two-spaces',
                name: 'Hotkey: Ensure two spaces at end of lines',
                hotkeys: [{ modifiers: this.parseHotkey().modifiers, key: this.parseHotkey().key }],
                editorCallback: (editor) => {
                    this.ensureTwoSpaces(editor);
                },
            });
        }

        // Add settings tab
        this.addSettingTab(new EnsureTwoSpacesSettingTab(this.app, this));
    }

    onunload() {
        console.log('Unloading Ensure Two Spaces plugin');
    }

    parseHotkey() {
        const hotkeyParts = this.settings.hotkeyText.split('+');
        const key = hotkeyParts.pop()?.toLowerCase() || '';
        const modifiers = hotkeyParts.map(mod => mod.toLowerCase());
        return { modifiers, key };
    }

    ensureTwoSpaces(editor) {
        const content = editor.getValue();
        const lines = content.split('\n');
        let inCodeBlock = false;
        let inFrontMatter = false;
        let changedContent = '';
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Check for front matter
            if (i === 0 && line === '---') {
                inFrontMatter = true;
                changedContent += line + '\n';
                continue;
            }
            
            if (inFrontMatter) {
                if (line === '---') {
                    inFrontMatter = false;
                }
                changedContent += line + '\n';
                continue;
            }
            
            // Check for code blocks
            if (line.trim().startsWith('```')) {
                inCodeBlock = !inCodeBlock;
                changedContent += line + '\n';
                continue;
            }
            
            // Skip code blocks and front matter if configured
            if ((inCodeBlock && this.settings.excludeCodeBlocks) || 
                (inFrontMatter && this.settings.excludeFrontMatter)) {
                changedContent += line + '\n';
                continue;
            }
            
            // Process normal lines - ensure they end with exactly two spaces
            const trimmedLine = line.trimEnd();
            if (trimmedLine.length > 0) { // Don't add spaces to empty lines
                changedContent += trimmedLine + '  \n';
            } else {
                changedContent += '\n';
            }
        }
        
        // Remove the trailing newline added in the loop
        changedContent = changedContent.slice(0, -1);
        
        // Only update if content has changed
        if (content !== changedContent) {
            const cursor = editor.getCursor();
            editor.setValue(changedContent);
            editor.setCursor(cursor);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class EnsureTwoSpacesSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl('h2', {text: 'Ensure Two Spaces Settings'});

        new obsidian.Setting(containerEl)
            .setName('Run on save')
            .setDesc('Automatically ensure all lines end with two spaces when saving a note')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.runOnSave)
                .onChange(async (value) => {
                    this.plugin.settings.runOnSave = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Enable hotkey')
            .setDesc('Allow using a hotkey to ensure two spaces')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.allowHotkey)
                .onChange(async (value) => {
                    this.plugin.settings.allowHotkey = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Hotkey')
            .setDesc('Format: Ctrl+Alt+Key or similar')
            .addText(text => text
                .setPlaceholder('Ctrl+Alt+Space')
                .setValue(this.plugin.settings.hotkeyText)
                .onChange(async (value) => {
                    this.plugin.settings.hotkeyText = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Exclude code blocks')
            .setDesc('Skip adding spaces in code blocks (recommended)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.excludeCodeBlocks)
                .onChange(async (value) => {
                    this.plugin.settings.excludeCodeBlocks = value;
                    await this.plugin.saveSettings();
                }));

        new obsidian.Setting(containerEl)
            .setName('Exclude front matter')
            .setDesc('Skip adding spaces in YAML front matter (recommended)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.excludeFrontMatter)
                .onChange(async (value) => {
                    this.plugin.settings.excludeFrontMatter = value;
                    await this.plugin.saveSettings();
                }));
    }
}

module.exports = EnsureTwoSpacesPlugin;
