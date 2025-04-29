# obsidian-ensure-two-spaces
"Obsidian plugin to ensure each line ends with exactly two spaces"

# Ensure Two Spaces Obsidian Plugin

This plugin automatically ensures that every line in your Markdown files ends with exactly two spaces, which creates soft line breaks in Markdown rendering.

## Features

- **Automatic Formatting**: Adds exactly two spaces at the end of each line when you save a document
- **Manual Trigger**: Use the command palette or a hotkey to format your document
- **Intelligent Handling**: Skips code blocks and YAML front matter by default
- **Customizable**: Configure hotkeys and behavior through settings

## Installation

### Using BRAT

1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) from the Obsidian Community Plugins
2. Open the Command Palette and run "BRAT: Add a beta plugin for testing"
3. Enter the URL of this repository
4. Enable the "Ensure Two Spaces" plugin in your Obsidian settings under Community Plugins

## Usage

Once installed and enabled, the plugin works in the following ways:

1. **Automatic Mode**: By default, the plugin will automatically add two spaces at the end of each line whenever you save a document.

2. **Manual Trigger**: You can manually ensure all lines have two spaces by using the command palette (Ctrl+P) and searching for "Ensure all lines end with exactly two spaces".

3. **Hotkey**: By default, the plugin assigns Ctrl+Alt+Space to trigger the two spaces function. You can change this in the plugin settings.

## Settings

- **Run on save**: Automatically add two spaces when saving a document
- **Enable hotkey**: Allow using a keyboard shortcut
- **Hotkey**: Customize the keyboard shortcut
- **Exclude code blocks**: Skip adding spaces in code blocks (recommended)
- **Exclude front matter**: Skip adding spaces in YAML front matter (recommended)

## Why Use This Plugin?

In Markdown, adding two spaces at the end of a line creates a "soft line break." This plugin automates this task, ensuring consistent formatting across your notes.
