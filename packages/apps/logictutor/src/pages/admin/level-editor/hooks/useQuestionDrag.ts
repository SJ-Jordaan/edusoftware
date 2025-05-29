import { useDrag, useDrop } from 'react-dnd';

interface Item {
  id: string;
  index: number;
}

export const useQuestionDrag = (
  type: string,
  id: string,
  index: number,
  moveItem: (dragIndex: number, hoverIndex: number) => void,
) => {
  const [, drag] = useDrag(() => {
    return {
      type,
      item: { id, index },
    };
  }, [id, index, moveItem]);

  const [, drop] = useDrop(
    () => ({
      accept: type,
      hover(item: Item) {
        if (item.index !== index) {
          moveItem(item.index, index);
          item.index = index;
        }
      },
    }),
    [index, moveItem],
  );

  return { drag, drop };
};
