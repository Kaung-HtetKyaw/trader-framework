'use client';
import { BaseButton } from '@/components/ui/base-button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import DeleteBinIcon from '../svgs/DeleteBinIcon';
import ModalActionButton from './ModalActionButton';
import { useDeleteClusterMutation } from '@/store/api/clusterApi';
import { useDispatch, useSelector } from 'react-redux';
import { setClusters, setSelectedClusterName } from '@/store/slices/clusterSlice';
import { RootState } from '@/store/store';
import { CustomToast } from '../CustomToast';
import { notifyErrorFromResponse } from '@/lib/utils/error';
import LoadingSpinner from '../LoadingSpinner';

type DeleteClusterModalProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  renderTrigger?: () => React.ReactNode;
};

const DeleteClusterModal = ({ renderTrigger, id, open, onOpenChange, onSuccess }: DeleteClusterModalProps) => {
  const dispatch = useDispatch();
  const allClusters = useSelector((state: RootState) => state.cluster.allClusters);
  const selectedCluster = useSelector((state: RootState) => state.cluster.selectedClusterName);
  const [deleteCluster, { isLoading }] = useDeleteClusterMutation();

  const handleDelete = async () => {
    try {
      const response = await deleteCluster({ clusterID: id });

      const { error, notify } = notifyErrorFromResponse(response);

      if (error) {
        return notify(error.errorMessage);
      }

      // Update Redux state
      const newClusters = allClusters.filter(cluster => cluster.id !== id);
      dispatch(setClusters(newClusters));

      // Clear selected cluster if it's the one being deleted
      const clusterToDelete = allClusters.find(cluster => cluster.id === id);
      if (clusterToDelete && selectedCluster === clusterToDelete.name) {
        dispatch(setSelectedClusterName(''));
      }

      CustomToast({
        type: 'success',
        message: 'The cluster has successfully been removed!',
      });

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to delete cluster:', error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Remove Cluster</DialogTitle>
      <DialogDescription className="sr-only">Remove Cluster from Kubegrade</DialogDescription>

      <DialogTrigger onClick={e => e.stopPropagation()} asChild>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <BaseButton variant="outlined" color="error" size="small" className="flex flex-row gap-1">
            <DeleteBinIcon className="w-[14px] h-[14px]" />
            <p className="body-2 text-error-500 ">Remove Cluster</p>
          </BaseButton>
        )}
      </DialogTrigger>
      <DialogContent
        className="w-[480px] max-w-none px-12 py-8 bg-white rounded-xl flex flex-col justify-center items-center gap-6"
        onOpenAutoFocus={e => e.preventDefault()} // prevent input auto-focus
      >
        <div className="w-full flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteBinIcon className="!w-12 !h-12 text-error-500" />

            <div className="text-center text-text-950 text-lg font-medium leading-[21.6px]">
              Remove Cluster from Kubegrade
            </div>
          </div>

          <div className="w-full text-center text-sm leading-[16.8px] text-text-950">
            <p>Are you sure you want to remove this cluster?</p>
            <br />
            <p>This action will remove the selected cluster and all associated data from Kubegrade. </p>
            <br />
            <p>
              If the Kubegrade scanner is still running in the cluster, it will continue reporting and the cluster will
              reappear.
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 pt-2">
          <ModalActionButton action="cancel" onClick={handleClose}>
            Cancel
          </ModalActionButton>

          <ModalActionButton
            className="bg-error-600 hover:bg-error-500"
            action="submit"
            onClick={handleDelete}
            color="error"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner className="w-full gap-2">
                <p>Removing...</p>
              </LoadingSpinner>
            ) : (
              <span>Remove</span>
            )}
          </ModalActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteClusterModal;
