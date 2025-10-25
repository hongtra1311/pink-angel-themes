import * as vscode from "vscode";
// declare setTimeout for this TS environment
declare function setTimeout(
  handler: (...args: any[]) => void,
  timeout?: number
): any;
// removed unused helper `getWebviewHtml`; extension only needs the activation logic below

class PinkThemeTreeDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    return Promise.resolve([
      new vscode.TreeItem(
        "Pink Theme Settings",
        vscode.TreeItemCollapsibleState.Collapsed
      ),
    ]);
  }
}

export function activate(context: vscode.ExtensionContext) {
  vscode.window.registerTreeDataProvider(
    "pinkThemeExplorer",
    new PinkThemeTreeDataProvider()
  );

  // Auto-apply the Pink Icons file icon theme and Pink Theme color theme once
  // on first activation. We persist a flag in globalState so this runs only once.
  const APPLIED_KEY = "pinkTheme.autoApplied";
  const applied = context.globalState.get<boolean>(APPLIED_KEY, false);
  if (!applied) {
    // small delay so VS Code has registered contributions (themes/icon themes)
    setTimeout(async () => {
      try {
        // Intentionally do NOT change the user's file icon theme.

        // Apply color theme (one of the contributed themes)
        await vscode.workspace
          .getConfiguration("workbench")
          .update(
            "colorTheme",
            "Pink Theme",
            vscode.ConfigurationTarget.Global
          );

        // Remember we've applied the themes so we don't do it again
        await context.globalState.update(APPLIED_KEY, true);

        // Intentionally do not show a confirmation popup — user requested no prompt.
      } catch (err) {
        // Log any error; don't interrupt activation flow.
        // eslint-disable-next-line no-console
        console.error("Failed to auto-apply Pink Theme or Pink Icons:", err);
      }
    }, 800);
  }
}
