// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "commit-reminder" is now active!');

	
	
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let commitReminderDisposable = vscode.commands.registerCommand('extension.addCommitReminder', () => {

		 vscode.window.showInputBox({prompt: 'add commit description' , 
		 placeHolder: 'description'}).then( desc =>{
			if (desc === undefined) 
				return;
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.edit( builder =>{
					builder.insert(new vscode.Position(0,0),`//CMT: *${new Date().toLocaleString()}*: ${desc}\r\n`);
				})
			}
		 })
	});

	context.subscriptions.push(commitReminderDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
