// Deprecated API Types (from /cluster.deprecatedAPIGroup.find)
export interface DeprecatedAPIDetail {
  kind: string;
  name: string;
  removedIn: string;
  deprecated: boolean;
  deprecatedIn: string;
  clusterK8SVersion: string;
  replacementVersion: string;
  currentGroupVersion: string;
}

export interface ClusterDeprecatedAPIResponse {
  id: string;
  organizationID: string;
  deprecatedAPIs: DeprecatedAPIDetail[];
}

// Addon Compatibility Types (from /cluster.nextUpgrade.find)
export interface MutualIncompatible {
  version: string;
  minMutualVersion: string;
  maxMutualVersion: string;
}

export interface MatchedComponent {
  name: string;
  version: string;
  nextCompatible: boolean;
  minCompatVersion: string;
  maxCompatVersion: string;
  mutualInCompatibles: Record<string, MutualIncompatible>;
}

export interface UnmatchedComponent {
  name: string;
  version: string;
}

export interface ResolverResponse {
  nextK8SVersion: string;
  matchedComponents: MatchedComponent[];
  unmatchedComponents: UnmatchedComponent[];
}
