import { Level } from '@edusoftware/core/src/types';
import { useModal } from '../../../components';
import {
  useCreateLevelMutation,
  useDeleteLevelMutation,
  useFetchLevelsQuery,
} from '../../../slices/levelApi.slice';
import { useState } from 'react';

export const useLevelManagement = () => {
  const [levelId, setLevelId] = useState<string | null>(null);

  const {
    data: levels,
    isLoading: isLevelsLoading,
    isFetching: isLevelsFetching,
    error: levelsError,
  } = useFetchLevelsQuery();

  const [createLevel, { isLoading: isCreating, error: createError }] =
    useCreateLevelMutation();

  const [deleteLevel, { isLoading: isDeleting, error: deleteError }] =
    useDeleteLevelMutation();

  const {
    isOpen: isCreateModalOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
  } = useModal();
  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const handleCreateLevel = async (level: Level) => {
    if (isCreating) return;

    try {
      await createLevel(level).unwrap();
      closeCreateModal();
    } catch (error) {
      // TODO: Proper error handling
      console.error('Failed to create level', error);
    }
  };

  const handleDeleteLevel = async () => {
    if (isDeleting || !levelId) return;

    try {
      await deleteLevel(levelId).unwrap();
      setLevelId(null);
      closeDeleteModal();
    } catch (error) {
      // TODO: Proper error handling
      console.error('Failed to delete level', error);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    openDeleteModal();
    setLevelId(id);
  };

  const isLoading =
    isLevelsLoading || isLevelsFetching || isCreating || isDeleting;
  const isError = Boolean(levelsError || createError || deleteError);

  return {
    levels,
    isLoading,
    isError,
    isCreateModalOpen,
    isDeleteModalOpen,
    handleCreateLevel,
    handleDeleteLevel,
    closeDeleteModal,
    closeCreateModal,
    handleOpenDeleteModal,
    openCreateModal,
  };
};
