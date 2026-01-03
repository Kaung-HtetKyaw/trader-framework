# ESLint Plugins

This directory contains custom ESLint plugins used in the project.

## Feature Flags Validation Plugin

The feature flags validation plugin (`feature-flags-validation.mjs`) is a custom ESLint rule that helps maintain consistency in feature flag configurations. It ensures that child features are not enabled when their parent feature is disabled, preventing potential unexpected behavior in the application.

### Purpose

Feature flags are commonly used to control the visibility and functionality of different features in an application. This plugin helps maintain a logical hierarchy of feature flags by enforcing that child features cannot be enabled when their parent feature is disabled.

### Rule Details

The rule checks for the following conditions:

- Validates feature flag objects that contain an `enabled` property or child features
- Ensures that child features are not enabled when their parent feature is disabled
- Reports errors when this condition is violated

### Examples

#### Basic Cases

```javascript
// ❌ Invalid - Child feature enabled while parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: true, // This will trigger an error
    },
  },
};

// ✅ Valid - Child feature disabled when parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: false,
    },
  },
};

// ✅ Valid - Child feature enabled when parent is enabled
const featureFlags = {
  parentFeature: {
    enabled: true,
    childFeature: {
      enabled: true,
    },
  },
};
```

#### Nested Feature Flags

```javascript
// ❌ Invalid - Deeply nested child enabled while parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: false,
      grandChildFeature: {
        enabled: true, // This will trigger an error
      },
    },
  },
};

// ✅ Valid - All nested features disabled when parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: false,
      grandChildFeature: {
        enabled: false,
      },
    },
  },
};
```

#### Multiple Sibling Features

```javascript
// ❌ Invalid - One sibling enabled while parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature1: {
      enabled: false,
    },
    childFeature2: {
      enabled: true, // This will trigger an error
    },
  },
};

// ✅ Valid - All siblings disabled when parent is disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature1: {
      enabled: false,
    },
    childFeature2: {
      enabled: false,
    },
  },
};
```

#### Root Level Features

```javascript
// ✅ Valid - Root level features can be enabled independently
const featureFlags = {
  feature1: {
    enabled: true,
  },
  feature2: {
    enabled: false,
  },
};

// ✅ Valid - Root level features with children
const featureFlags = {
  feature1: {
    enabled: true,
    childFeature: {
      enabled: true,
    },
  },
  feature2: {
    enabled: false,
    childFeature: {
      enabled: false,
    },
  },
};
```

#### Complex Nested Structure

```javascript
// ❌ Invalid - Complex nested structure with enabled child
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: false,
      subFeature: {
        enabled: true, // This will trigger an error
        subSubFeature: {
          enabled: true, // This will also trigger an error
        },
      },
    },
  },
};

// ✅ Valid - Complex nested structure with all disabled
const featureFlags = {
  parentFeature: {
    enabled: false,
    childFeature: {
      enabled: false,
      subFeature: {
        enabled: false,
        subSubFeature: {
          enabled: false,
        },
      },
    },
  },
};
```

#### Mixed Feature Flags (Boolean and Object)

```javascript
// ❌ Invalid - Mix of boolean and object features with enabled child
const featureFlags = {
  parentFeature: false,
  childFeature: {
    enabled: true, // This will trigger an error
  },
};

// ✅ Valid - Mix of boolean and object features with disabled child
const featureFlags = {
  parentFeature: false,
  childFeature: {
    enabled: false,
  },
};

// ✅ Valid - Mix of boolean and object features with enabled parent
const featureFlags = {
  parentFeature: true,
  childFeature: {
    enabled: true,
  },
};
```

#### Complex Mixed Structure

```javascript
// ❌ Invalid - Complex mix of boolean and object features
const featureFlags = {
  parentFeature: false,
  childFeature2: {
    enabled: true, // This will trigger an error
    subFeature1: {
      enabled: true, // This will trigger an error
    },
    subFeature2: true, // This will trigger an error
  },
};

// ✅ Valid - Complex mix with all disabled when parent is disabled
const featureFlags = {
  parentFeature: false,
  childFeature2: {
    enabled: false,
    subFeature1: {
      enabled: false,
    },
    subFeature2: false,
  },
};

// ✅ Valid - Complex mix with all enabled when parent is enabled
const featureFlags = {
  parentFeature: true,
  childFeature2: {
    enabled: true,
    subFeature1: {
      enabled: true,
    },
    subFeature2: true,
  },
};
```

### Disabling the Rule

If you need to disable this rule for a specific line, you can use:

```javascript
// eslint-disable-next-line local/feature-flags-validation
```

### Configuration

The rule is configured as a suggestion with error severity. It can be enabled in your ESLint configuration file:

```javascript
{
  "rules": {
    "local/feature-flags-validation": "error"
  }
}
```

### How It Works

The plugin:

1. Identifies feature flag objects by looking for objects with an `enabled` property or child features
2. Traverses the feature flag hierarchy recursively
3. Checks if child features are enabled when their parent is disabled
4. Reports errors with descriptive messages indicating the path to the problematic feature flag

### Error Messages

When a violation is detected, the plugin generates an error message in the following format:

```
Child feature "parent.child" is enabled while parent feature "parent" is disabled. This may lead to unexpected behavior. If this is intentional, you can disable this rule by adding // eslint-disable-next-line local/feature-flags-validation to the line.
```
