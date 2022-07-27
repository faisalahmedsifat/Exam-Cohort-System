import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

// HeadlessUI
import { Dialog } from "@headlessui/react";

// Icons
import { PlusSmIcon } from '@heroicons/react/outline';

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const QuestionDisplayCard = ({ body, handleDeleteQuestion }) => {
  if (body.type === "MCQ") {
    return (
      <div className='flex flex-col hover:ring gap-5 py-5 px-5 rounded-md mt-10 bg-white'>
        <div className='ml-2'>
          <div className='flex flex-row justify-between items-center'>
            <div className='text-lg font-semibold text-slate-800'>Question Info:</div>
            <div className='text-md font-semibold text-white bg-flat_red1 hover:bg-flat_red2
              py-2 px-2 rounded hover:cursor-pointer' onClick={() => handleDeleteQuestion(body.questionID)}>Delete</div>
          </div>
          <div className='mt-2'>
            <div className='text-sm font-semibold text-slate-500'>Type: {body.type}</div>
            <div className='text-sm font-semibold text-slate-500'>Marks: {body.marks}</div>
            <div className='text-sm font-semibold text-slate-500'>Time Limit: {body.timeLimit} Minutes</div>
          </div>
        </div>
        <div className='border-b-2'></div>
        <div className='text-slate-800 font-bold'>{body.mcqQuestionDetails.mcqStatement}</div>
        <div className='flex flex-col gap-y-2'>
          <div className={`py-2 px-2 rounded-lg text-white font-semibold ${body.mcqQuestionDetails.mcqOp1IsCor ? 'bg-flat_green1' : 'bg-flat_white2'}`}>1. {body.mcqQuestionDetails.mcqOp1}</div>
          <div className={`py-2 px-2 rounded-lg text-white font-semibold ${body.mcqQuestionDetails.mcqOp2IsCor ? 'bg-flat_green1' : 'bg-flat_white2'}`}>2. {body.mcqQuestionDetails.mcqOp2}</div>
          <div className={`py-2 px-2 rounded-lg text-white font-semibold ${body.mcqQuestionDetails.mcqOp3IsCor ? 'bg-flat_green1' : 'bg-flat_white2'}`}>3. {body.mcqQuestionDetails.mcqOp3}</div>
          <div className={`py-2 px-2 rounded-lg text-white font-semibold ${body.mcqQuestionDetails.mcqOp4IsCor ? 'bg-flat_green1' : 'bg-flat_white2'}`}>4. {body.mcqQuestionDetails.mcqOp4}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div>micro viva question</div>
    )
  }

}

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName }) => {
  const [assessmentsQuestions, setAssessmentsQuestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef()
  const currentUser = useSelector(store => store.currentUser.value)

  // Fetch Question List
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const assessmentsQuestionsList = await cohortService.getQuestionsList(currentUser.token, cohortID, assessmentID);
        setAssessmentsQuestions(assessmentsQuestionsList);
      } catch (e) {
        notification.error(e.message, 2000)
      }
    }
    fetchQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteQuestion = async (questionID) => {
    try {
      await cohortService.deleteQuestion(currentUser.token, cohortID, assessmentID, questionID)
      setAssessmentsQuestions(current => current.filter(question => question.questionID !== questionID))
      notification.info("Question Deleted!", 2000);
    } catch (error) {
      notification.error(error.message, 2000)
    }
  }

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsOpen(false);
    try {
      const currentForm = modalRef.current
      let body = [{
        type: "MCQ",
        marks: currentForm["marks"].value,
        timeLimit: currentForm["timeLimit"].value,
        details: {
          mcqStatement: currentForm["mcqStatement"].value,
          mcqOp1: currentForm["mcqOp1"].value,
          mcqOp2: currentForm["mcqOp2"].value,
          mcqOp3: currentForm["mcqOp3"].value,
          mcqOp4: currentForm["mcqOp4"].value,
          mcqOp1IsCor: currentForm["mcqOp1IsCor"].checked,
          mcqOp2IsCor: currentForm["mcqOp2IsCor"].checked,
          mcqOp3IsCor: currentForm["mcqOp3IsCor"].checked,
          mcqOp4IsCor: currentForm["mcqOp4IsCor"].checked
        }
      }]
      const newQues = await cohortService.addQuestionToAssessment(currentUser.token, cohortID, assessmentID, body)
      setAssessmentsQuestions(assessmentsQuestions.concat(newQues[0]))
      notification.success("Successfully Added!", 2000);
    } catch (error) {
      notification.error(error.message, 2000);
    }
  }

  return (
    <div className="grow">
      <Header halfHeader={true} title={`Questions of ${assessmentName}`} />
      <div className="bg-flat_white1 p-10">
        <div className="bg-flat_white1">
          <div className="flex flex-row items-center justify-between pb-5 border-b-2">
            <div>
              <div className="text-lg text-slate-700">
                Questions List for: {assessmentName}
              </div>
              <div className="text-sm text-slate-500">
                You can add a new question by clicking on the button on the
                right.
              </div>
            </div>
            <button
              className="bg-flat_blue1 hover:bg-flat_blue2 text-md text-white
                rounded shadow px-2 py-2"
            >
              <div className="flex flex-row">
                <PlusSmIcon className="h-5 w-5" />
                <div className="pl-2" onClick={() => setIsOpen(true)}>
                  Add Question
                </div>
              </div>
            </button>
          </div>
        </div>
        <Dialog
          as="div"
          className="relative z-50"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <form onSubmit={handleAddQuestion} ref={modalRef}>
            <div className="fixed inset-0 flex items-center">
              <Dialog.Panel className="mx-auto max-w-xl w-full rounded bg-white">
                <Dialog.Title className="text-lg font-bold px-3 pt-4">
                  Add a new Question
                </Dialog.Title>
                <Dialog.Description className="px-5 pt-4 flex flex-col gap-y-5 items-center">
                  <div className="w-full flex flex-col gap-y-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mr-3"
                      htmlFor="newCandidateName"
                    >
                      Question Statement
                    </label>
                    <input
                      name="mcqStatement"
                      required
                      className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      type="text"
                      placeholder="Questions Statement"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex">
                      <label
                        className="flex-grow block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="newCandidateName"
                      >
                        Option 1
                      </label>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="mcqOp1IsCor"
                      >
                        Correct Answer?
                      </label>
                      <input name="mcqOp1IsCor" type="checkbox" />
                    </div>
                    <input
                      name="mcqOp1"
                      required
                      className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      type="text"
                      placeholder="Option 1"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex">
                      <label
                        className="flex-grow block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="newCandidateName"
                      >
                        Option 2
                      </label>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="mcqOp2IsCor"
                      >
                        Correct Answer?
                      </label>
                      <input name="mcqOp2IsCor" type="checkbox" />
                    </div>
                    <input
                      name="mcqOp2"
                      required
                      className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      type="text"
                      placeholder="Option 2"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex">
                      <label
                        className="flex-grow block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="newCandidateName"
                      >
                        Option 3
                      </label>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="mcqOp3IsCor"
                      >
                        Correct Answer?
                      </label>
                      <input name="mcqOp3IsCor" type="checkbox" />
                    </div>
                    <input
                      name="mcqOp3"
                      required
                      className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      type="text"
                      placeholder="Option 3"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-y-2">
                    <div className="flex">
                      <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                        Option 4
                      </label>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                        htmlFor="mcqOp4IsCor"
                      >
                        Correct Answer?
                      </label>
                      <input name="mcqOp4IsCor" type="checkbox" />
                    </div>
                    <input
                      name="mcqOp4"
                      required
                      className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                      type="text"
                      placeholder="Option 4"
                    />
                  </div>
                  <div className="w-full flex flex-row items-center gap-x-5">
                    <div className="w-full flex flex-col gap-y-2">
                      <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                        Marks
                      </label>
                      <input
                        name="marks"
                        required
                        className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                        type="number"
                        pattern="\d*"
                        step="1"
                        placeholder="Marks"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-y-2">
                      <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                        Time Limit
                      </label>
                      <input
                        name="timeLimit"
                        required
                        className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                        type="number"
                        pattern="\d*"
                        step="1"
                        placeholder="Time Limit in Minutes"
                      />
                    </div>
                  </div>
                </Dialog.Description>
                <div className="flex flex-row items-center justify-end gap-5 py-5 pr-5">
                  <button
                    type="submit"
                    className="bg-flat_green1 hover:bg-flat_green2 py-2
      text-white text-md rounded-md px-5"
                  >
                    Add
                  </button>
                  <button
                    className="bg-flat_red1 hover:bg-flat_red2 py-2
      text-white text-md rounded-md px-5"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </form>
        </Dialog>
        <div>
          {assessmentsQuestions.map((question) => {
            return (
              <QuestionDisplayCard
                key={question.questionID}
                body={question}
                handleDeleteQuestion={handleDeleteQuestion}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const QuestionList = () => {
  const { cohortID, assessmentID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
  const [assessmentName, setAssessmentName] = useState('Assessment');
  const currentUser = useSelector(store => store.currentUser.value)

  useEffect(() => {
    const getCohortName = async () => {
      if (currentUser != null) {
        try {
          const cohort = await cohortService.getSingleCohortDetails(currentUser.token, cohortID);
          setCohortName(cohort.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    const getAssessmentName = async () => {
      if (currentUser != null) {
        try {
          const assessment = await cohortService.getSingleAssessmentDetails(currentUser.token, cohortID, assessmentID);
          setAssessmentName(assessment.name);
        } catch (e) {
          notification.error(e.message, 2000)
        }
      }
    }
    getCohortName();
    getAssessmentName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleAssessment cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName} />
      <Maincontent cohortID={cohortID} cohortName={cohortName} assessmentID={assessmentID} assessmentName={assessmentName} />
    </div>
  )
}

export default QuestionList