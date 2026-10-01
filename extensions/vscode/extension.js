const vscode = require('vscode');
const path = require('path');
const { checkEyd } = require('../../src/linter');

let diagnosticCollection;

function activate(context) {
  diagnosticCollection = vscode.languages.createDiagnosticCollection('eyd-v');
  context.subscriptions.push(diagnosticCollection);

  // Jalankan linter saat dokumen dibuka atau diedit
  vscode.workspace.onDidOpenTextDocument(lintDocument, null, context.subscriptions);
  vscode.workspace.onDidChangeTextDocument(event => lintDocument(event.document), null, context.subscriptions);
  vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri), null, context.subscriptions);

  // Lint dokumen aktif saat extension baru menyala
  if (vscode.window.activeTextEditor) {
    lintDocument(vscode.window.activeTextEditor.document);
  }

  // Daftarkan Quick Fix Provider (CodeAction)
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    ['markdown', 'plaintext'],
    {
      provideCodeActions(document, range, context) {
        const actions = [];
        for (const diagnostic of context.diagnostics) {
          if (diagnostic.source === 'EYD V' && diagnostic.suggestion) {
            const fix = new vscode.CodeAction(
              `Ganti dengan '${diagnostic.suggestion}' (EYD V)`,
              vscode.CodeActionKind.QuickFix
            );
            fix.edit = new vscode.WorkspaceEdit();
            fix.edit.replace(document.uri, diagnostic.range, diagnostic.suggestion);
            fix.diagnostics = [diagnostic];
            fix.isPreferred = true;
            actions.push(fix);
          }
        }
        return actions;
      }
    }
  );
  context.subscriptions.push(codeActionProvider);

  // Command: Periksa Dokumen
  const checkCmd = vscode.commands.registerCommand('eyd-v.check', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      lintDocument(editor.document);
      vscode.window.showInformationMessage('EYD V: Pemeriksaan selesai.');
    }
  });
  context.subscriptions.push(checkCmd);

  // Command: Terapkan Semua Perbaikan Otomatis
  const fixAllCmd = vscode.commands.registerCommand('eyd-v.fixAll', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const text = document.getText();
    const config = vscode.workspace.getConfiguration('eydv');
    const result = checkEyd(text, { mode: config.get('mode', 'general') });

    if (result.valid) {
      vscode.window.showInformationMessage('EYD V: Dokumen sudah sesuai kaidah.');
      return;
    }

    editor.edit(editBuilder => {
      const wholeRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      editBuilder.replace(wholeRange, result.correctedText);
    }).then(success => {
      if (success) {
        vscode.window.showInformationMessage(`EYD V: Berhasil memperbaiki ${result.errorCount} ketidaksesuaian.`);
      }
    });
  });
  context.subscriptions.push(fixAllCmd);
}

function lintDocument(document) {
  if (!document) return;
  const lang = document.languageId;
  if (lang !== 'markdown' && lang !== 'plaintext') return;

  const config = vscode.workspace.getConfiguration('eydv');
  if (!config.get('enable', true)) {
    diagnosticCollection.delete(document.uri);
    return;
  }

  const text = document.getText();
  const mode = config.get('mode', 'general');
  const result = checkEyd(text, { mode });

  const diagnostics = [];

  for (const err of result.errors) {
    if (err.index === undefined) continue;
    const startPos = document.positionAt(err.index);
    const endPos = document.positionAt(err.index + err.original.length);
    const range = new vscode.Range(startPos, endPos);

    const diagnostic = new vscode.Diagnostic(
      range,
      `[${err.type}] ${err.rule} (Saran: ${err.suggestion})`,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostic.source = 'EYD V';
    diagnostic.code = err.type;
    diagnostic.suggestion = err.suggestion;

    diagnostics.push(diagnostic);
  }

  diagnosticCollection.set(document.uri, diagnostics);
}

function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.clear();
    diagnosticCollection.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
