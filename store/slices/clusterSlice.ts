import { Cluster } from "@/types/cluster";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClusterState {
    selectedClusterName: string | null;
    allClusters: Cluster[];
    isConnectClusterModalOpen: boolean;
}

const initialState: ClusterState = {
    selectedClusterName: null,
    allClusters: [],
    isConnectClusterModalOpen: false,
};

const clusterSlice = createSlice({
    name: "cluster",
    initialState,
    reducers: {
        setSelectedClusterName: (state, action: PayloadAction<string>) => {
            state.selectedClusterName = action.payload;
        },
        setClusters: (state, action: PayloadAction<Cluster[]>) => {
            state.allClusters = action.payload;
        },
        openConnectClusterModal: (state) => {
            state.isConnectClusterModalOpen = true;
        },
        closeConnectClusterModal: (state) => {
            state.isConnectClusterModalOpen = false;
        },
    },
});

export const { setSelectedClusterName, setClusters, openConnectClusterModal, closeConnectClusterModal } = clusterSlice.actions;
export default clusterSlice.reducer;
