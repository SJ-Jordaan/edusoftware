import { useState } from 'react';
import { GateType } from '@edusoftware/core/src/algorithms';
import { gateMap } from '../../../components/grid-circuit/LogicGates';
import { TruthTable } from '../level-solver/components/TruthTable';

import CompleteDesk from '../../../assets/tutorial/CompleteDesk.png';
import CompleteMob from '../../../assets/tutorial/CompleteMob.png';
import ConnectDesk1 from '../../../assets/tutorial/ConnectDesk1.png';
import ConnectDesk2 from '../../../assets/tutorial/ConnectDesk2.png';
import ConnectMob1 from '../../../assets/tutorial/ConnectMob1.png';
import ConnectMob2 from '../../../assets/tutorial/ConnectMob2.png';
import IncorrectDesk from '../../../assets/tutorial/IncorrectDesk.png';
import IncorrectMob from '../../../assets/tutorial/IncorrectMob.png';
import MovingDesk from '../../../assets/tutorial/MovingDesk.png';
import MovingMob from '../../../assets/tutorial/MovingMob.png';
import PreDesk from '../../../assets/tutorial/PreDesk.png';
import PreMob from '../../../assets/tutorial/PreMob.png';
import QuestionInfoDesk from '../../../assets/tutorial/QuestionInfoDesk.png';
import QuestionInfoDeskTT from '../../../assets/tutorial/QuestionInfoDeskTT.png';
import QuestionInfoMob from '../../../assets/tutorial/QuestionInfoMob.png';
import QuestionInfoMobTT from '../../../assets/tutorial/QuestionInfoMobTT.png';
import ToolbarDesk from '../../../assets/tutorial/ToolbarDesk.png';
import ToolbarMob from '../../../assets/tutorial/ToolbarMob.png';
import VideoTutorial from '../../../assets/tutorial/LogicTutorial.mp4';

export const Tutorial = () => {
  const [activeTab, setActiveTab] = useState<
    'gates' | 'building_pc' | 'building_mobile' | 'video_tutorial'
  >('gates');

  const gateTutorialItems: {
    gateName: GateType;
    description: string;
    expression: string;
    expr: string;
    symbol?: string;
  }[] = [
    {
      gateName: 'input',
      description:
        'The INPUT node has no inputs and a single output. It represents an external signal (such as A, B or C) that can be used in the circuit.',
      expression: 'A',
      expr: 'A',
      symbol: 'A',
    },
    {
      gateName: 'output',
      description:
        'The OUTPUT node has a single input and no outputs. It represents the final result of the circuit, showing the evaluated value of the connected expression.',
      expression: 'A',
      expr: 'A',
    },
    {
      gateName: 'not',
      description:
        'The NOT gate has a single input and a single output. It inverts the input signal: if A is 1, the output X is 0; if A is 0, the output X is 1. The truth table shows this relationship.',
      expression: `A'${''}`,
      expr: '!A',
    },
    {
      gateName: 'and',
      description:
        'The AND gate has two inputs and one output. It outputs 1 only when both inputs are 1. Otherwise, the output is 0. The truth table shows this relationship.',
      expression: 'A · B',
      expr: 'A&B',
    },
    {
      gateName: 'or',
      description:
        'The OR gate has two inputs and one output. It outputs 1 when at least one input is 1. The output is 0 only when both inputs are 0. The truth table shows this relationship.',
      expression: 'A + B',
      expr: 'A|B',
    },
    {
      gateName: 'xor',
      description:
        'The XOR gate (exclusive OR) has two inputs and one output. It outputs 1 when the inputs are different, and 0 when the inputs are the same. The truth table shows this relationship.',
      expression: 'A ⊕ B',
      expr: 'A^B',
    },
  ];

  // At the top of the file, after your imports
  const pcTutorialSections = [
    {
      title: 'Question Goal',
      description: (
        <>
          The goal of each question is to use the provided Boolean expression or
          truth table under <strong>Question Info</strong> to construct the
          corresponding circuit.
        </>
      ),
      images: [
        {
          src: QuestionInfoDesk,
          alt: 'Question Info Desktop',
          caption: 'Question Info (Boolean Expression)',
        },
        {
          src: QuestionInfoDeskTT,
          alt: 'Question Info Desktop Truth Table',
          caption: 'Question Info (Truth Table)',
        },
      ],
    },
    {
      title: 'Moving Gates',
      description: (
        <>
          To move a gate within the grid, click and hold the gate, then drag it
          to the desired cell before releasing.
        </>
      ),
      images: [
        {
          src: MovingDesk,
          alt: 'Moving Gates Desktop',
          caption: 'Moving Gates',
        },
      ],
    },
    {
      title: 'Connecting Gates',
      description: (
        <>
          To connect the output of one gate to the input of another, click on
          the source gate. A line will extend from its output to your cursor.
          Click on the target gate to complete the connection. To remove a
          gate&apos;s output connection, click on the gate twice.
        </>
      ),
      images: [
        {
          src: ConnectDesk1,
          alt: 'Connecting Gates Desktop',
          caption: 'Connecting Gates',
        },
        {
          src: ConnectDesk2,
          alt: 'Connected Gates Desktop',
          caption: 'Connected Gates',
        },
      ],
    },
    {
      title: 'Toolbar Question',
      description: (
        <>
          In a Toolbar Question, all available gates are listed in a toolbar.
          Drag and drop a gate from the toolbar onto the grid, then connect
          gates by following the instructions in the{' '}
          <strong>Connecting Gates</strong> section.
        </>
      ),
      images: [
        {
          src: ToolbarDesk,
          alt: 'Toolbar Question Desktop',
          caption: 'Toolbar Question Example',
        },
      ],
    },
    {
      title: 'Pre-Placed Gates Question',
      description: (
        <>
          In a Pre-Placed Gates Question, all required gates are already placed
          on the grid. Your task is to connect them correctly. Gates may be
          repositioned by following the <strong>Moving Gates</strong> section,
          and connections are made as described in{' '}
          <strong>Connecting Gates</strong>.
        </>
      ),
      images: [
        {
          src: PreDesk,
          alt: 'Pre-Placed Gates Desktop',
          caption: 'Pre-Placed Gates Example',
        },
      ],
    },
    {
      title: 'Submitting Solutions',
      description: (
        <>
          Once your circuit is complete, click the{' '}
          <strong>Submit Answer</strong> button on the right-hand side of the
          screen. If your solution does not match the provided truth table or
          Boolean expression, an error message or counterexample will appear,
          along with a hint if available. If your solution is correct, you will
          proceed to the next question, or if it is the final question of the
          level, you will return to the challenge page.
        </>
      ),
      images: [
        {
          src: IncorrectDesk,
          alt: 'Incorrect answer Desktop',
          caption: 'Incorrect answer Example',
        },
        {
          src: CompleteDesk,
          alt: 'Complete submission Desktop',
          caption: 'Complete submission Example',
        },
      ],
    },
  ];

  const mobileTutorialSections = [
    {
      title: 'Question Goal',
      description: (
        <>
          The goal of each question is to use the provided Boolean expression or
          truth table under <strong>Question Info</strong> to construct the
          corresponding circuit.
        </>
      ),
      images: [
        {
          src: QuestionInfoMob,
          alt: 'Question Info Mobile',
          caption: 'Question Info (Boolean Expression)',
        },
        {
          src: QuestionInfoMobTT,
          alt: 'Question Info Mobile Truth Table',
          caption: 'Question Info (Truth Table)',
        },
      ],
    },
    {
      title: 'Moving Gates',
      description: (
        <>
          To move a gate within the grid, tap and hold the gate, then drag it to
          the desired cell before releasing.
        </>
      ),
      images: [
        {
          src: MovingMob,
          alt: 'Moving Gates Mobile',
          caption: 'Moving Gates',
        },
      ],
    },
    {
      title: 'Connecting Gates',
      description: (
        <>
          To connect the output of one gate to the input of another, tap the
          source gate. The gate cell will be highlighted. Tap the target gate to
          complete the connection.
        </>
      ),
      images: [
        {
          src: ConnectMob1,
          alt: 'Connecting Gates Mobile',
          caption: 'Connecting Gates',
        },
        {
          src: ConnectMob2,
          alt: 'Connected Gates Mobile',
          caption: 'Connected Gates',
        },
      ],
    },
    {
      title: 'Toolbar Question',
      description: (
        <>
          In a Toolbar Question, all available gates appear in a toolbar. Drag a
          gate from the toolbar onto the grid, then connect the gates by
          following the <strong>Connecting Gates</strong> instructions.
        </>
      ),
      images: [
        {
          src: ToolbarMob,
          alt: 'Toolbar Question Mobile',
          caption: 'Toolbar Question Example',
        },
      ],
    },
    {
      title: 'Pre-Placed Gates Question',
      description: (
        <>
          In a Pre-Placed Gates Question, all required gates are already placed
          on the grid. Your task is to connect them correctly. Gates can be
          repositioned by following the <strong>Moving Gates</strong>{' '}
          instructions, and connections are made as described in{' '}
          <strong>Connecting Gates</strong>.
        </>
      ),
      images: [
        {
          src: PreMob,
          alt: 'Pre-Placed Gates Mobile',
          caption: 'Pre-Placed Gates Example',
        },
      ],
    },
    {
      title: 'Submitting Solutions',
      description: (
        <>
          Once your circuit is complete, tap the <strong>Submit Answer</strong>{' '}
          button at the bottom of the screen (you may need to scroll down to see
          this). If your solution does not match the provided truth table or
          Boolean expression, an error message or counterexample will appear,
          along with a hint if available. If your solution is correct, you will
          proceed to the next question, or if it is the final question of the
          level, you will return to the challenge page.
        </>
      ),
      images: [
        {
          src: IncorrectMob,
          alt: 'Incorrect answer Mobile',
          caption: 'Incorrect Answer Example',
        },
        {
          src: CompleteMob,
          alt: 'Complete submission Mobile',
          caption: 'Complete Submission Example',
        },
      ],
    },
  ];

  return (
    <div className="p-6">
      <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
        Tutorial
      </h2>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('gates')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'gates'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Gates
        </button>
        <button
          onClick={() => setActiveTab('building_pc')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'building_pc'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Building Circuits (PC)
        </button>
        <button
          onClick={() => setActiveTab('building_mobile')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'building_mobile'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Building Circuits (Mobile)
        </button>
        <button
          onClick={() => setActiveTab('video_tutorial')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'video_tutorial'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Tutorial Video
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'gates' && (
        <div className="flex flex-col gap-8">
          {gateTutorialItems.map((gateItem) => (
            <div key={gateItem.gateName}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {gateItem.gateName.toUpperCase()} Gate
              </h2>
              <hr className="my-2" />

              <div className="flex flex-col gap-4 md:grid md:grid-cols-[1fr_4fr_2fr] md:items-center md:gap-8">
                {/* Description on top for mobile */}
                <p className="text-md text-gray-900 md:order-2 md:col-span-1 dark:text-white">
                  {gateItem.description}
                </p>

                {/* Gate diagram */}
                <div className="flex justify-center md:order-1">
                  {gateMap(gateItem.gateName, gateItem.symbol)}
                </div>

                {/* Expression + Truth Table */}
                <div className="flex flex-col gap-2 md:order-3">
                  <p className="text-md text-gray-900 dark:text-white">
                    {gateItem.expression} = X
                  </p>
                  <TruthTable
                    booleanExpression={gateItem.expr}
                    outputSymbol="X"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'building_pc' && (
        <div className="flex flex-col gap-4">
          {pcTutorialSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <hr className="my-2" />
              <p className="text-md text-gray-900 dark:text-white">
                {section.description}
              </p>

              {/* Render images if any */}
              {section.images && section.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {section.images.map((img, idx) => (
                    <div className="flex flex-col items-center" key={idx}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-96 w-auto rounded shadow"
                      />
                      <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {img.caption}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'building_mobile' && (
        <div className="flex flex-col gap-4">
          {mobileTutorialSections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
              <hr className="my-2" />
              <p className="text-md text-gray-900 dark:text-white">
                {section.description}
              </p>

              {section.images && section.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {section.images.map((img, idx) => (
                    <div className="flex flex-col items-center" key={idx}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-96 w-auto rounded object-contain shadow"
                      />
                      <span className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {img.caption}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'video_tutorial' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tutorial Video
          </h2>
          <hr className="my-2" />
          <video src={VideoTutorial} controls className="rounded-lg" />
        </div>
      )}
    </div>
  );
};
