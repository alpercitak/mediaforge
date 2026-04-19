import { ref, onMounted, onBeforeUnmount } from 'vue';

export const useBodyDrag = (onDropFiles: (fileList: FileList) => void) => {
  const isDragging = ref<boolean>(false);
  let dragCounter = 0;

  const onDragEnter = (e: DragEvent): void => {
    e.preventDefault();
    dragCounter++;
    isDragging.value = true;
  };

  const onDragOver = (e: DragEvent): void => {
    e.preventDefault();
  };

  const onDragLeave = (e: DragEvent): void => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      isDragging.value = false;
    }
  };

  const onDrop = (e: DragEvent): void => {
    e.preventDefault();
    dragCounter = 0;
    isDragging.value = false;

    if (!e.dataTransfer?.files?.length) {
      return;
    }

    onDropFiles(e.dataTransfer.files);
  };

  onMounted(() => {
    document.body.addEventListener('dragenter', onDragEnter);
    document.body.addEventListener('dragover', onDragOver);
    document.body.addEventListener('dragleave', onDragLeave);
    document.body.addEventListener('drop', onDrop);
  });

  onBeforeUnmount(() => {
    document.body.removeEventListener('dragenter', onDragEnter);
    document.body.removeEventListener('dragover', onDragOver);
    document.body.removeEventListener('dragleave', onDragLeave);
    document.body.removeEventListener('drop', onDrop);
  });

  return {
    isDragging,
  };
};
