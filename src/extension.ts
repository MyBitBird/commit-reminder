// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

const root: string = undefinedToString(vscode.workspace.rootPath);
const fileName = 'commitReminder.json';
const commitFile = vscode.Uri.file(`${root}\\${fileName}`);
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

		vscode.window.showInputBox({
			prompt: 'add commit description',
			placeHolder: 'description'
		}).then(desc => {
			if (desc === undefined)
				return;

			const editor = vscode.window.activeTextEditor;
			let commits: [ReminderCommit];

			vscode.workspace.findFiles(fileName).then(file => {

				if (file.length == 0) {
					commits = [(new ReminderCommit(getPath(editor), desc))];
					saveCommits(commits);
				}
				else {
					getCommits().then(result => {
						commits = result;
						const existIndex = commits.findIndex(x => x.path == getPath(editor));

						if (existIndex >= 0)
							commits[existIndex].desc = desc;
						else
							commits.push(new ReminderCommit(getPath(editor), desc));

						saveCommits(commits);
					});
				}

			});
		})
	});

	let removeCommitReminderDisposable = vscode.commands.registerCommand('extension.removeCommitReminder', () => {

	})

	let disposable = vscode.commands.registerCommand('extension.getCommitReminders', () => {

		/*vscode.workspace.openTextDocument({content:'Tesssssssttttttdasdsadsadsadsadsadsadsasdsadsat',language:'txt'}).then( doc => {
			vscode.window.showTextDocument(doc,{ viewColumn: vscode.ViewColumn.Beside });

		});*/
		vscode.commands.executeCommand("cursorEnd");


	});


	context.subscriptions.push(commitReminderDisposable);
	context.subscriptions.push(removeCommitReminderDisposable);
	context.subscriptions.push(disposable);
}

function saveCommits(commits: [ReminderCommit]) {
	vscode.workspace.fs.writeFile(commitFile, Buffer.from(JSON.stringify(commits)));
}

function getCommits() {

	return vscode.workspace.fs.readFile(commitFile)
		.then(data => {
			return JSON.parse(new TextDecoder('utf-8').decode(data));
		});
}

// this method is called when your extension is deactivated
export function deactivate() { }

class ReminderCommit {
	path: string;
	desc: string;
	timestamp: number;
	constructor(path: string | undefined, desc: string) {
		this.path = undefinedToString(path);
		this.desc = desc;
		this.timestamp = + new Date()
	}
}

function undefinedToString(param: string | undefined) {
	return param == undefined ? '' : param;
}

function getPath(editor: vscode.TextEditor | undefined) {
	return editor?.document.uri.fsPath.replace(root, '')
}
