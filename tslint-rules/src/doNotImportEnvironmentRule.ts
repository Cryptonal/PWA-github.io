import * as Lint from 'tslint';
import { ImportDeclaration, SourceFile, SyntaxKind } from 'typescript';

import { RuleHelpers } from './ruleHelpers';

class DoNotImportEnvironmentWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: SourceFile) {
    if (!sourceFile.fileName.endsWith('module.ts')) {
      super.visitSourceFile(sourceFile);
    }
  }

  visitImportDeclaration(importStatement: ImportDeclaration) {
    const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, SyntaxKind.StringLiteral);
    const fromStringText = fromStringToken.getText();
    if (fromStringText.includes('environments/environment')) {
      this.addFailureAtNode(importStatement, 'Importing environment is not allowed. Inject needed properties instead.');
    }
  }
}

/**
 * Implementation of the do-not-import-environment rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new DoNotImportEnvironmentWalker(sourceFile, this.getOptions()));
  }
}