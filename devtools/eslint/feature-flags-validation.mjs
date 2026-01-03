/**
 * @type {import('eslint').Rule.RuleModule}
 */
export const featureFlagsValidation = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Errors when child features are enabled while parent feature is disabled',
      recommended: 'error',
    },
  },
  create(context) {
    const isFeatureFlagObject = (node) => {
      if (!node || node.type !== 'ObjectExpression') return false;

      const hasEnabledProperty = node.properties.some(
        (p) =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'enabled'
      );

      const hasChildFeatures = node.properties.some(
        (p) => p.type === 'Property' && p.value.type === 'ObjectExpression'
      );

      return hasEnabledProperty || hasChildFeatures;
    };

    const isBooleanFeature = (node) => {
      const result =
        node &&
        node.type === 'Property' &&
        node.value.type === 'Literal' &&
        typeof node.value.value === 'boolean';

      return result;
    };

    const getEnabledValue = (node) => {
      if (node && node.type === 'Literal' && typeof node.value === 'boolean') {
        return node.value;
      }

      if (!node || node.type !== 'ObjectExpression') {
        return false;
      }

      const enabledProperty = node.properties.find(
        (p) =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'enabled'
      );

      const result =
        enabledProperty &&
        enabledProperty.value.type === 'Literal' &&
        enabledProperty.value.value === true;

      return result;
    };

    const getErrorMessage = (childPath, parentPath) => {
      return `Child feature "${childPath}" is enabled while parent feature "${
        parentPath || 'root'
      }" is disabled. This may lead to unexpected behavior. If this is intentional, you can disable this rule by adding // eslint-disable-next-line local/feature-flags-validation to the line.`;
    };

    const checkChildFeatures = (node, parentEnabled, parentPath = '') => {
      if (isBooleanFeature(node) && !parentEnabled) {
        return;
      }

      if (!node || node.type !== 'ObjectExpression') {
        return;
      }

      if (!parentPath) {
        node.properties.forEach((property) => {
          const childEnabled = getEnabledValue(property.value);
          checkChildFeatures(property.value, childEnabled, property.key.name);
        });
        return;
      }

      node.properties.forEach((property) => {
        if (property.key.name === 'enabled') {
          return;
        }

        if (
          property.value.type === 'Literal' &&
          typeof property.value.value === 'boolean'
        ) {
          const childEnabled = getEnabledValue(property.value);
          if (!parentEnabled && childEnabled) {
            const childPath = parentPath
              ? `${parentPath}.${property.key.name}`
              : property.key.name;

            context.report({
              node: property,
              message: getErrorMessage(childPath, parentPath),
              severity: 2,
            });
          }

          return;
        }

        if (
          property.type === 'Property' &&
          property.value.type === 'ObjectExpression'
        ) {
          const childPath = parentPath
            ? `${parentPath}.${property.key.name}`
            : property.key.name;

          if (isFeatureFlagObject(property.value)) {
            const childEnabled = getEnabledValue(property.value);

            if (!parentEnabled && childEnabled) {
              context.report({
                node: property,
                message: getErrorMessage(childPath, parentPath),
                severity: 2,
              });
            }
            checkChildFeatures(property.value, childEnabled, childPath);
          }
        }
      });
    };

    return {
      VariableDeclarator(node) {
        if (!node.init || node.init.type !== 'ObjectExpression') {
          return;
        }

        if (isFeatureFlagObject(node.init)) {
          const isEnabled = getEnabledValue(node.init);
          checkChildFeatures(node.init, isEnabled);
        }
      },
    };
  },
};
