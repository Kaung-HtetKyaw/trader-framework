/**
 * This module exports upgrade plan types organized into three distinct layers:
 *
 * 1. API Types (./api) - Raw backend response structures
 * 2. Frontend Types (./frontend) - UI state management and component props
 * 3. Agent Types (./agent) - Payloads sent to the upgrad
 */

// Layer 1: Backend API Types
export type {
  DeprecatedAPIDetail,
  ClusterDeprecatedAPIResponse,
  MutualIncompatible,
  MatchedComponent,
  UnmatchedComponent,
  ResolverResponse,
} from './api';

// Layer 2: Frontend Domain Types
export type {
  UpgradePlanItemType,
  MutualIncompatibilityEntry,
  SelectedDeprecatedAPIItem,
  SelectedAddonCompatibilityItem,
  SelectedAddonMutualIncompatibilityItem,
  SelectedUpgradePlanItem,
  UpgradePlanItemTypeMap,
  UpgradePlanSelectionState,
} from './frontend';

// Layer 3: Agent Request Types
export type {
  AgentDeprecatedAPIItem,
  AgentAddonCompatibilityItem,
  AgentMutualIncompatibilityItem,
  UpgradePlanAgentRequest,
} from './agent';
