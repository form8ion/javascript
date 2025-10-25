import any from '@travi/any';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';

import buildDocumentationCommand from './generation-command.js';
import scaffoldDocumentation from './scaffolder.js';

vi.mock('./generation-command.js');

describe('documentation scaffolder', () => {
  const packageManager = any.word();
  const documentationGenerationCommand = any.string();
  const tocMessage = `Run \`${documentationGenerationCommand}\` to generate a table of contents`;
  const contributionDocumentation = `### Dependencies

\`\`\`sh
$ nvm install
$ ${packageManager} install
\`\`\`

### Verification

\`\`\`sh
$ ${packageManager} test
\`\`\``;

  beforeEach(() => {
    when(buildDocumentationCommand).calledWith(packageManager).thenReturn(documentationGenerationCommand);
  });

  it('should provide project-type documentation and contribution details', () => {
    const projectTypeResults = {documentation: any.simpleObject()};

    expect(scaffoldDocumentation({projectTypeResults, packageManager})).toEqual({
      toc: tocMessage,
      ...projectTypeResults.documentation,
      contributing: contributionDocumentation
    });
  });

  it('should not include project-type documentation when not provided', () => {
    const projectTypeResults = {documentation: undefined};

    expect(scaffoldDocumentation({projectTypeResults, packageManager})).toEqual({
      toc: tocMessage,
      contributing: contributionDocumentation
    });
  });
});
