import any from '@travi/any';
import {assert} from 'chai';

import {validate} from './validator.js';

suite('options validator', () => {
  test('that the options are required', () => assert.throws(() => validate(), '"value" is required'));

  test('that the `projectRoot` is required', () => {
    assert.throws(() => validate({}), '"projectRoot" is required');
  });

  test('that the `projectName` is required', () => assert.throws(
    () => validate({projectRoot: any.string()}),
    '"projectName" is required'
  ));

  test('that the `projectName` should not include a scope', () => {
    const projectName = `@${any.word()}/${any.word()}`;

    assert.throws(
      () => validate({projectRoot: any.string(), projectName}),
      `"projectName" with value "${projectName}" matches the inverted pattern: /^@\\w*\\//`
    );
  });

  suite('visibility', () => {
    test('that the `visibility` is required', () => assert.throws(
      () => validate({projectRoot: any.string(), projectName: any.string()}),
      '"visibility" is required'
    ));

    test('that `Public` is an allowed `visibility`', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: 'Public',
      license: any.string(),
      vcs: {host: any.word(), owner: any.word(), name: any.word()},
      description: any.string()
    }));

    test('that `Private` is an allowed `visibility`', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: 'Private',
      license: any.string(),
      vcs: {host: any.word(), owner: any.word(), name: any.word()},
      description: any.string()
    }));

    test('that `visibility` values other than `Public` or `Private` are invalid', () => assert.throws(
      () => validate({projectRoot: any.string(), projectName: any.string(), visibility: any.word()}),
      '"visibility" must be one of [Public, Private]'
    ));
  });

  test('that `license` is required', () => assert.throws(
    () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private'])
    }),
    '"license" is required'
  ));

  test('that `pathWithinParent` is allowed', () => validate({
    projectRoot: any.string(),
    projectName: any.string(),
    visibility: any.fromList(['Public', 'Private']),
    license: any.string(),
    plugins: {unitTestFrameworks: {}},
    pathWithinParent: any.string()
  }));

  suite('vcs', () => {
    test('that `vcs.host` is required', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {}
      }),
      '"vcs.host" is required'
    ));

    test('that `vcs.owner` is required', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word()}
      }),
      '"vcs.owner" is required'
    ));

    test('that `vcs.name` is required', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word()}
      }),
      '"vcs.name" is required'
    ));
  });

  suite('configs', () => {
    suite('eslint', () => {
      test('that `scope` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {eslint: {}}
        }),
        '"configs.eslint.scope" is required'
      ));

      test('that `scope` must be a string', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {eslint: {scope: any.simpleObject()}}
        }),
        '"configs.eslint.scope" must be a string'
      ));

      test('that `scope` starts with `@`', () => {
        const scope = any.word();

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {eslint: {scope}}
          }),
          `"configs.eslint.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that `scope` does not contain a `/`', () => {
        const scope = `@${any.word()}/${any.word()}`;

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {eslint: {scope}}
          }),
          `"configs.eslint.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that scope can contain a `-`', () => {
        const scope = `@${any.word()}-${any.word()}`;

        validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          description: any.string(),
          configs: {eslint: {scope}}
        });
      });
    });

    suite('typescript', () => {
      test('that `scope` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {typescript: {}}
        }),
        '"configs.typescript.scope" is required'
      ));

      test('that `scope` must be a string', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {typescript: {scope: any.simpleObject()}}
        }),
        '"configs.typescript.scope" must be a string'
      ));

      test('that `scope` starts with `@`', () => {
        const scope = any.word();

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {typescript: {scope}}
          }),
          `"configs.typescript.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that `scope` does not contain a `/`', () => {
        const scope = `@${any.word()}/${any.word()}`;

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {typescript: {scope}}
          }),
          `"configs.typescript.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that scope can contain a `-`', () => {
        const scope = `@${any.word()}-${any.word()}`;

        validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          description: any.string(),
          configs: {typescript: {scope}}
        });
      });
    });

    suite('prettier', () => {
      test('that `scope` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {prettier: {}}
        }),
        '"configs.prettier.scope" is required'
      ));

      test('that `scope` must be a string', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {prettier: {scope: any.simpleObject()}}
        }),
        '"configs.prettier.scope" must be a string'
      ));

      test('that `scope` starts with `@`', () => {
        const scope = any.word();

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {prettier: {scope}}
          }),
          `"configs.prettier.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that `scope` does not contain a `/`', () => {
        const scope = `@${any.word()}/${any.word()}`;

        assert.throws(
          () => validate({
            projectRoot: any.string(),
            projectName: any.string(),
            visibility: any.fromList(['Public', 'Private']),
            license: any.string(),
            vcs: {host: any.word(), owner: any.word(), name: any.word()},
            ci: any.string(),
            description: any.string(),
            configs: {prettier: {scope}}
          }),
          `"configs.prettier.scope" with value "${scope}" fails to match the scope pattern`
        );
      });

      test('that scope can contain a `-`', () => {
        const scope = `@${any.word()}-${any.word()}`;

        validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          description: any.string(),
          configs: {prettier: {scope}}
        });
      });
    });

    suite('commitlint', () => {
      test('that `packageName` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {commitlint: {}}
        }),
        '"configs.commitlint.packageName" is required'
      ));

      test('that `name` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {commitlint: {packageName: any.string()}}
        }),
        '"configs.commitlint.name" is required'
      ));
    });

    suite('babel preset', () => {
      test('that `packageName` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {babelPreset: {}}
        }),
        '"configs.babelPreset.packageName" is required'
      ));

      test('that `name` is required', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          ci: any.string(),
          description: any.string(),
          configs: {babelPreset: {packageName: any.string()}}
        }),
        '"configs.babelPreset.name" is required'
      ));
    });

    suite('remark preset', () => {
      test('that the definition must be a string, when defined', () => assert.throws(
        () => validate({
          projectRoot: any.string(),
          projectName: any.string(),
          visibility: any.fromList(['Public', 'Private']),
          license: any.string(),
          vcs: {host: any.word(), owner: any.word(), name: any.word()},
          description: any.string(),
          configs: {remark: {}}
        }),
        '"configs.remark" must be a string'
      ));

      test('that the validation passes when a string is provided', () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        configs: {remark: any.string()}
      }));

      test('that the config is optional', () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        configs: {}
      }));
    });
  });

  suite('ci services', () => {
    const ciServiceName = any.word();

    test('that the scaffolder function is required', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        plugins: {ciServices: {[ciServiceName]: {}}}
      }),
      `"plugins.ciServices.${ciServiceName}.scaffold" is required`
    ));

    test('that a provided ci-service scaffold must accept a single argument', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        plugins: {ciServices: {[ciServiceName]: {scaffold: () => undefined}}}
      }),
      `"plugins.ciServices.${ciServiceName}.scaffold" must have an arity greater or equal to 1`
    ));

    test('that a provided ci-service scaffolder can be enabled', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      vcs: {host: any.word(), owner: any.word(), name: any.word()},
      description: any.string(),
      plugins: {ciServices: {[ciServiceName]: {scaffold: options => options}}}
    }));
  });

  suite('hosts', () => {
    const hostName = any.word();

    test('that the scaffolder function is required', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        plugins: {hosts: {[hostName]: {}}}
      }),
      `"plugins.hosts.${hostName}.scaffold" is required`
    ));

    test('that a provided scaffolder must accept a single argument', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        plugins: {hosts: {[hostName]: {scaffold: () => undefined}}}
      }),
      `"plugins.hosts.${hostName}.scaffold" must have an arity greater or equal to 1`
    ));
  });

  suite('application types', () => {
    const key = any.word();

    test('that a provided application-type must define config', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {
          applicationTypes: {[key]: any.word()}
        }
      }),
      `"plugins.applicationTypes.${key}" must be of type object`
    ));

    test('that a provided application-type must provide a scaffolded', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {
          applicationTypes: {[key]: {}}
        }
      }),
      `"plugins.applicationTypes.${key}.scaffold" is required`
    ));

    test('that a provided application-type must provide a scaffold function', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {
          applicationTypes: {[key]: {scaffold: any.word()}}
        }
      }),
      `"plugins.applicationTypes.${key}.scaffold" must be of type function`
    ));

    test('that a provided application-type scaffolder must accept a single argument', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {
          applicationTypes: {[key]: {scaffold: () => undefined}}
        }
      }),
      `"plugins.applicationTypes.${key}.scaffold" must have an arity greater or equal to 1`
    ));

    test('that a provided application-type scaffolder is valid if an options object is provided', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      plugins: {
        applicationTypes: {[key]: {scaffold: options => options}}
      }
    }));
  });

  suite('package types', () => {
    const key = any.word();

    test('that a provided package-type must define config', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {
          packageTypes: {[key]: any.word()}
        }
      }),
      `"plugins.packageTypes.${key}" must be of type object`
    ));

    test('that a provided package-type must provide a scaffolded', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {packageTypes: {[key]: {}}}
      }),
      `"plugins.packageTypes.${key}.scaffold" is required`
    ));

    test('that a provided package-type must provide a scaffold function', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {packageTypes: {[key]: {scaffold: any.word()}}}
      }),
      `"plugins.packageTypes.${key}.scaffold" must be of type function`
    ));

    test('that a provided package-type scaffolder must accept a single argument', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {packageTypes: {[key]: {scaffold: () => undefined}}}
      }),
      `"plugins.packageTypes.${key}.scaffold" must have an arity greater or equal to 1`
    ));

    test('that a provided package-type scaffolder is valid if an options object is provided', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      plugins: {packageTypes: {[key]: {scaffold: options => options}}}
    }));
  });

  suite('monorepo types', () => {
    const key = any.word();

    test('that a provided monorepo-type must define config', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {monorepoTypes: {[key]: any.word()}}
      }),
      `"plugins.monorepoTypes.${key}" must be of type object`
    ));

    test('that a provided monorepo-type must provide a scaffolded', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {monorepoTypes: {[key]: {}}}
      }),
      `"plugins.monorepoTypes.${key}.scaffold" is required`
    ));

    test('that a provided monorepo-type must provide a scaffold function', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {monorepoTypes: {[key]: {scaffold: any.word()}}}
      }),
      `"plugins.monorepoTypes.${key}.scaffold" must be of type function`
    ));

    test('that a provided monorepo-type scaffolder must accept a single argument', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        plugins: {monorepoTypes: {[key]: {scaffold: () => undefined}}}
      }),
      `"plugins.monorepoTypes.${key}.scaffold" must have an arity greater or equal to 1`
    ));

    test('that a provided monorepo-type scaffolder is valid if an options object is provided', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      plugins: {monorepoTypes: {[key]: {scaffold: options => options}}}
    }));
  });

  suite('registries', () => {
    const key = any.word();

    test('that a `registries` must be an object`', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        unitTestFrameworks: {},
        registries: any.word()
      }),
      '"registries" must be of type object'
    ));

    test('that the values of `registries` must be strings`', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        unitTestFrameworks: {},
        registries: {[key]: any.integer()}
      }),
      `"registries.${key}" must be a string`
    ));

    test('that the values of `registries` must be URIs`', () => assert.throws(
      () => validate({
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        unitTestFrameworks: {},
        registries: {[key]: any.string()}
      }),
      `"registries.${key}" must be a valid uri`
    ));

    test('that valid `registries` definition does not throw an error`', () => validate({
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      registries: {[key]: any.url()}
    }));
  });

  test(
    'that `configs`, `overrides`, `hosts`, `ciServices`, `applicationTypes`, `registries`, and `packageTypes`'
    + ' default to empty objects',
    () => {
      const options = {
        projectRoot: any.string(),
        projectName: any.string(),
        visibility: any.fromList(['Public', 'Private']),
        license: any.string(),
        vcs: {host: any.word(), owner: any.word(), name: any.word()},
        description: any.string(),
        plugins: {unitTestFrameworks: {}}
      };

      const validated = validate(options);

      assert.deepEqual(
        validated,
        {
          ...options,
          configs: {},
          plugins: {
            applicationTypes: {},
            packageTypes: {},
            monorepoTypes: {},
            packageBundlers: {},
            unitTestFrameworks: {},
            hosts: {},
            ciServices: {}
          },
          registries: {}
        }
      );
    }
  );

  test('that `decisions` is allowed', () => {
    const options = {
      projectRoot: any.string(),
      projectName: any.string(),
      visibility: any.fromList(['Public', 'Private']),
      license: any.string(),
      decisions: any.simpleObject(),
      plugins: {unitTestFrameworks: {}}
    };

    validate(options);
  });
});
