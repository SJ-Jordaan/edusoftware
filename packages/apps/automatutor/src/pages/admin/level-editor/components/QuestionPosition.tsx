import { AccordionItem } from '../../../../components/Accordion';
import { ItemType } from '../../common/symbols';
import { useQuestionDrag } from '../hooks/useQuestionDrag';
import { QuestionBuilderObject } from '../hooks/useLevelEditor';

interface QuestionPositionProps {
  question: QuestionBuilderObject;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  index: number;
  onClick: () => void;
}

const QuestionPosition = ({
  question,
  moveQuestion,
  index,
  onClick,
}: QuestionPositionProps) => {
  const { drag, drop } = useQuestionDrag(
    ItemType.QUESTION,
    question._id,
    index,
    moveQuestion,
  );

  return (
    <AccordionItem
      _ref={(node) => drag(drop(node))}
      id={question._id}
      title={question.questionContent}
      onClick={() => onClick()}
    ></AccordionItem>
  );
};

export default QuestionPosition;
