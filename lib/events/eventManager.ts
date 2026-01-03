
import { createEventEmitter } from './core/eventEmitter';
import { createConnectionManager } from './core/connectionManager';
import { createSSEAdapter } from './adapters/sseAdapter';
import type { K8sEvent } from '@/types/event';
import config from '@/lib/config';

export type StreamStatus = 'idle' | 'connecting' | 'streaming' | 'error' | 'connected';

// Global state
let eventManagerInstance: EventManager | null = null;
let connectionCount = 0;
let connectSeq = 0;

// Configuration
let tokenRef: string | undefined;
let beginAtRef: string | undefined;
let objectIDsRef: string[] | undefined;
let clusterIDRef: string | undefined;

// Global callbacks
let statusCallback: ((status: StreamStatus) => void) | null = null;
let eventCallback: ((data: { event: K8sEvent }) => void) | null = null;
let clearCallback: (() => void) | null = null;

interface EventManager {
  setConfig: (params: {
    token?: string;
    beginAt?: string;
    objectIDs?: string[];
    clusterID?: string;
    onStatus?: (status: StreamStatus) => void;
    onEvent?: (data: { event: K8sEvent }) => void;
    onClear?: () => void;
  }) => void;
  getConnectionCount: () => number;
  disconnect: () => void;
}

function createEventManager(): EventManager {
  const emitter = createEventEmitter();
  const connectionManager = createConnectionManager(emitter);
  
  createSSEAdapter({ emitter });
  
  let hasReceivedEvent = false;
  let currentConnectSeq = 0;

  const mapConnectionStateToStreamStatus = (state: string): StreamStatus => {
    switch (state) {
      case 'connecting': return 'connecting';
      case 'connected': return 'connected';
      case 'error': return 'error';
      case 'closed':
      case 'idle':
      default:
        return 'idle';
    }
  };

  // Handle live events
  emitter.on('k8sEvent.detected', (rawEvent) => {
    if (currentConnectSeq !== connectSeq) return;

    if (!hasReceivedEvent) {
      hasReceivedEvent = true;
      if (statusCallback) statusCallback('streaming');
    }

    if (eventCallback) eventCallback({ event: rawEvent as K8sEvent });
  });

  // Map connection state to stream status
  emitter.on('connectionStateChange', (state) => {
    const streamStatus = mapConnectionStateToStreamStatus(state);
    if (statusCallback) statusCallback(streamStatus);
  });

  // Handle connection retry requests
  emitter.on('connectionRetry', () => {
    if (eventCallback && tokenRef && beginAtRef &&
        ((objectIDsRef && objectIDsRef.length > 0) || clusterIDRef)) {
      startConnection();
    }
  });

  const startConnection = () => {
    currentConnectSeq = ++connectSeq;
    connectionCount++;
    hasReceivedEvent = false;
    
    // Clear events when starting new connection
    emitter.emit('clearEvents');
    
    const body: { beginAt?: string; objectIDs?: string[]; clusterID?: string } = {
      beginAt: beginAtRef
    };

    if (objectIDsRef && objectIDsRef.length > 0) {
      body.objectIDs = objectIDsRef;
    }

    if (clusterIDRef) {
      body.clusterID = clusterIDRef;
    }

    connectionManager.connect({
      url: `${config.NEXT_PUBLIC_API_BASE_URL}/cluster.k8sEvent.watch`,
      body,
      token: tokenRef,
      withCredentials: false,
    });
  };

  const disconnect = () => {
    connectSeq++; // Invalidate any ongoing operations
    connectionManager.disconnect();
    
    if (connectionCount > 0) {
      connectionCount--;
    }
  };




  const setConfig = (params: {
    token?: string;
    beginAt?: string;
    objectIDs?: string[];
    clusterID?: string;
    onStatus?: (status: StreamStatus) => void;
    onEvent?: (data: { event: K8sEvent }) => void;
    onClear?: () => void;
  }): void => {
    const changed = params.token !== tokenRef ||
                   params.beginAt !== beginAtRef ||
                   JSON.stringify(params.objectIDs) !== JSON.stringify(objectIDsRef) ||
                   params.clusterID !== clusterIDRef;

    // Always update callbacks
    statusCallback = params.onStatus || null;
    eventCallback = params.onEvent || null;
    clearCallback = params.onClear || null;

    // Only proceed if config actually changed
    if (!changed) {
      return;
    }

    // Update the refs
    tokenRef = params.token;
    beginAtRef = params.beginAt;
    objectIDsRef = params.objectIDs;
    clusterIDRef = params.clusterID;

    // Clear events when starting new connection
    if (clearCallback) clearCallback();

    // Disconnect existing connection if any
    const currentState = connectionManager.getState();
    if (currentState !== 'idle' && currentState !== 'closed') {
      disconnect();
    }

    // Connect immediately if we have callbacks and valid config
    if (eventCallback && tokenRef && beginAtRef &&
        ((objectIDsRef && objectIDsRef.length > 0) || clusterIDRef)) {
      startConnection();
    }
  };

  const getConnectionCount = (): number => {
    return connectionCount;
  };

  return {
    setConfig,
    getConnectionCount,
    disconnect,
  };
}

// Singleton pattern
function getEventManager(): EventManager {
  if (!eventManagerInstance) {
    eventManagerInstance = createEventManager();
  }
  return eventManagerInstance;
}

// Export the public API
export const setEventStreamConfig = (params: {
  token?: string;
  beginAt?: string;
  objectIDs?: string[];
  clusterID?: string;
  onStatus?: (status: StreamStatus) => void;
  onEvent?: (data: { event: K8sEvent }) => void;
  onClear?: () => void;
}) => getEventManager().setConfig(params);
export const getConnectionCount = () => getEventManager().getConnectionCount();