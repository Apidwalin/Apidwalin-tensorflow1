"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.hideFiles', hide), vscode.commands.registerCommand('extension.showFiles', show), vscode.commands.registerCommand('extension.toggleFiles', toggle));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function hide() {
    updateConfiguration(true);
}
function show() {
    updateConfiguration(false);
}
function toggle() {
    updateConfiguration();
}
const configKey = 'files.exclude';
function updateConfiguration(value) {
    const settings = [
        ...getGeneralSettings(),
        ...getFoldersSettings()
    ];
    if (value === undefined) {
        value = !getCurrentState(settings);
    }
    for (const setting of settings) {
        vscode.workspace.getConfiguration(undefined, setting.uri)
            .update(configKey, setState(setting.excludes, value), setting.target);
    }
}
function getGeneralSettings() {
    var config = vscode.workspace.getConfiguration()
        .inspect(configKey);
    const settings = [];
    if (config && config.globalValue) {
        settings.push({
            excludes: config.globalValue,
            target: vscode.ConfigurationTarget.Global
        });
    }
    if (config && config.workspaceValue) {
        settings.push({
            excludes: config.workspaceValue,
            target: vscode.ConfigurationTarget.Workspace
        });
    }
    return settings;
}
function getFoldersSettings() {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) {
        return [];
    }
    const settings = [];
    for (const folder of folders) {
        const config = vscode.workspace.getConfiguration(undefined, folder.uri)
            .inspect(configKey);
        if (!config || !config.workspaceFolderValue) {
            continue;
        }
        settings.push({
            uri: folder.uri,
            excludes: config.workspaceFolderValue,
            target: vscode.ConfigurationTarget.WorkspaceFolder
        });
    }
    return settings;
}
function getCurrentState(settings) {
    return settings.some(s => Object.values(s.excludes).some(v => v === true));
}
function setState(excludes, value) {
    for (const key of Object.keys(excludes)) {
        if (typeof excludes[key] === 'boolean') {
            excludes[key] = value;
        }
    }
    return excludes;
}
//# sourceMappingURL=extension.js.map