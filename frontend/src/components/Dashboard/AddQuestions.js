import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

// Firebase Storage
import firebaseService from "../../services/firebaseService"
import { ref, uploadBytes, deleteObject } from "firebase/storage"

// Recorder
import { ReactMediaRecorder } from "react-media-recorder";

// Icons
import { XCircleIcon } from '@heroicons/react/solid';
import { PlusCircleIcon, MicrophoneIcon } from '@heroicons/react/outline';
// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleAssessment from './SidebarForSingleAssessment'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'

const mcqOptionFormDefault = {
  mcqOptionText: '',
  isMcqOptionCor: false
}

const microResetValues = {
  blobUrl: '',
  blob: ''
}

const mcqQuestionFormDefault = {
  type: 'MCQ',
  mcqStatement: '',
  marks: 0,
  timeLimit: '',
  mcqOptions: []
}

const microVivaQuestionFormDefault = {
  type: 'MICROVIVA',
  marks: 0,
  timeLimit: '',
  questionAudio: microResetValues,
  correctAudio: microResetValues
}

const Maincontent = ({ cohortID, cohortName, assessmentID, assessmentName }) => {
  const [inputFields, setInputFields] = useState([])

  const currentUser = useSelector(store => store.currentUser.value)

  // Router Navigator
  const navigate = useNavigate();

  // Handle Question Audio
  const handleQuestionAudioChange = (blobUrl, blob, inputID) => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        inputField["questionAudio"] = { blobUrl, blob }
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const resetQuestionAudio = (clearBlobUrl, inputID) => {
    clearBlobUrl()
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        inputField["questionAudio"] = microResetValues
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const handleCorrectAudioChange = (blobUrl, blob, inputID) => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        inputField["correctAudio"] = { blobUrl, blob }
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const resetCorrectAudio = (clearBlobUrl, inputID) => {
    clearBlobUrl()
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        inputField["correctAudio"] = microResetValues
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const handleInputOnChange = (inputID, e) => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        inputField[e.target.name] = e.target.value
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const handleInputOnChangeOption = (inputID, optionID, e) => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === inputID) {
        const newOptionFields = inputField.mcqOptions.map(mcqOption => {
          if (mcqOption.id === optionID) {
            if (e.target.name === "isMcqOptionCor") {
              mcqOption[e.target.name] = !(mcqOption.isMcqOptionCor)
            } else {
              mcqOption[e.target.name] = e.target.value
            }
          }
          return mcqOption
        })
        inputField["mcqOptions"] = newOptionFields
      }
      return inputField;
    })
    setInputFields(newInputFields);
  }

  const handleAddMcqFields = () => {
    setInputFields(inputFields.concat({ ...mcqQuestionFormDefault, id: uuidv4() }))
  }

  const handleAddMicroFields = () => {
    setInputFields(inputFields.concat({ ...microVivaQuestionFormDefault, id: uuidv4() }))
  }

  const handleAddNewOption = id => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === id) {
        inputField['mcqOptions'] = [...inputField['mcqOptions'], { ...mcqOptionFormDefault, id: uuidv4() }]
      }
      return inputField;
    })
    setInputFields(newInputFields)
  }

  const handleRemoveFields = (id) => {
    setInputFields(oldInputFields => oldInputFields.filter((inputField, index) => inputField.id !== id))
  }

  const handleDeleteOption = (questionID, optionID) => {
    const newInputFields = inputFields.map(inputField => {
      if (inputField.id === questionID) {
        inputField['mcqOptions'] = inputField.mcqOptions.filter(option => option.id !== optionID)
      }
      return inputField;
    })
    setInputFields(newInputFields)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let firebaseFilesRefs = [] 
    try {
      let body = []
      for (let question of inputFields) {
        if (question.type === "MCQ") {
          let parsedMcqOptions = []
          for (const option of question.mcqOptions) {
            let singleOptionBody = {
              mcqOptionText: option.mcqOptionText,
              isMcqOptionCor: Boolean(option.isMcqOptionCor)
            }
            parsedMcqOptions.push(singleOptionBody)
          }
          let singleQuestionBody = {
            type: "MCQ",
            marks: Number(question.marks),
            timeLimit: Number(question.timeLimit),
            details: {
              mcqStatement: question.mcqStatement,
              mcqOptions: parsedMcqOptions
            }
          }
          body.push(singleQuestionBody)
        } else if (question.type === "MICROVIVA") {
          const micQuesAudioID = uuidv4()
          const micCorAudioID = uuidv4()

          const questionAudioRef = ref(firebaseService.firebaseStorage, `questions/prompt/${micQuesAudioID}.wav`)
          const answerAudioRef = ref(firebaseService.firebaseStorage, `questions/correct_answer/${micCorAudioID}.wav`)
          
          firebaseFilesRefs.push(questionAudioRef)
          firebaseFilesRefs.push(answerAudioRef)

          await uploadBytes(questionAudioRef, question.questionAudio.blob)
          await uploadBytes(answerAudioRef, question.correctAudio.blob)

          let singleQuestionBody = {
            type: "MICROVIVA",
            marks: Number(question.marks),
            timeLimit: Number(question.timeLimit),
            details:{
              micQuesAudioID: micQuesAudioID,
              micCorAudioID: micCorAudioID,
              micCorAnsText: "TODO"
            }
          }
          body.push(singleQuestionBody)
        }
      }
      await cohortService.addQuestionToAssessment(currentUser.token, cohortID, assessmentID, body)
      notification.success('Successfully Added!', 2000);
      navigate(`/examcohorts/${cohortID}/assessments/${assessmentID}/questions`)
    } catch (error) {
      for (const refOfFiles of firebaseFilesRefs) {
        await deleteObject(refOfFiles)
      }
      notification.error(error.message, 2000);
    }
  }

  return (
    <div className='grow'>
      <Header halfHeader={true} title={`Add Questions to ${assessmentName}`} />
      <div className='bg-flat_white1 p-10'>
        <div className="flex flex-row items-center justify-between pb-5 border-b-2">
          <div>
            <div className='text-lg text-slate-700'>Creating new Question(s)...</div>
            <div className='text-sm text-slate-500'>Click the type of question you want to add to the assessment, then fill the forms appropiately.</div>
          </div>
        </div>
        <form className="my-10">
          {
            inputFields.map((inputField, index) => {
              if (inputField.type === "MCQ") {
                return (
                  <div className='bg-white shadow flex flex-col py-5 px-5 mb-5 rounded gap-y-5' key={inputField.id}>
                    <div className='text-lg font-bold border-b-2 pb-5 flex justify-between items-center'>
                      <div className='px-2'>
                        MCQ Question
                      </div>
                      <XCircleIcon
                        onClick={() => handleRemoveFields(inputField.id)}
                        className='h-6 w-6 text-flat_red1 hover:text-flat_red2 hover:cursor-pointer'
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-x-5 px-2">
                      <div className="w-full flex flex-col gap-y-2">
                        <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                          Marks
                        </label>
                        <input
                          required
                          className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                          type="number"
                          pattern="\d*"
                          step="1"
                          placeholder="Marks"
                          name="marks"
                          value={inputField.marks}
                          onChange={(event) => handleInputOnChange(inputField.id, event)}
                        />
                      </div>
                      <div className="w-full flex flex-col gap-y-2">
                        <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                          Time Limit
                        </label>
                        <input
                          required
                          className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                          type="number"
                          pattern="\d*"
                          step="1"
                          placeholder="Time Limit in Minutes"
                          name="timeLimit"
                          value={inputField.timeLimit}
                          onChange={(event) => handleInputOnChange(inputField.id, event)}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-2 px-2'>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                      >
                        Question Statement
                      </label>
                      <input
                        className="appearance-none border rounded w-full mr-5 py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                        type="text"
                        placeholder="Questions Statement"
                        name="mcqStatement"
                        value={inputField.mcqStatement}
                        onChange={(event) => handleInputOnChange(inputField.id, event)}
                      />
                    </div>
                    {
                      inputField.mcqOptions.map((mcqOption, optionNo) => {
                        return (
                          <div className='flex flex-col gap-y-2 px-2' key={optionNo}>
                            <div className='flex justify-between'>
                              <label className="block text-gray-700 text-sm font-bold mr-3">
                                Option {optionNo + 1}
                              </label>
                              <div className='flex'>
                                <label className="block text-gray-700 text-sm font-bold mr-3">
                                  Correct Answer?
                                </label>
                                <input
                                  type="checkbox"
                                  name='isMcqOptionCor'
                                  checked={mcqOption.isMcqOptionCor}
                                  onChange={(event) => handleInputOnChangeOption(inputField.id, mcqOption.id, event)}
                                />
                              </div>
                            </div>
                            <div className='relative flex items-center justify-end'>
                              <input
                                required
                                className="appearance-none border rounded w-full py-2 px-3 pr-10 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                                type="text"
                                placeholder={`Option ${optionNo + 1} Text`}
                                name="mcqOptionText"
                                value={mcqOption.mcqOptionText}
                                onChange={(event) => handleInputOnChangeOption(inputField.id, mcqOption.id, event)}
                              />
                              <XCircleIcon
                                onClick={() => handleDeleteOption(inputField.id, mcqOption.id)}
                                className='absolute mr-1 h-6 w-6 text-flat_red1 hover:text-flat_red2 hover:cursor-pointer'
                              />
                            </div>
                          </div>
                        )
                      })
                    }
                    <div
                      onClick={() => handleAddNewOption(inputField.id)}
                      className='flex flex-row items-center justify-center
                              bg-flat_gray1 hover:bg-flat_gray2 hover:cursor-pointer px-3 py-2 
                              rounded shadow text-white font-medium'>
                      <PlusCircleIcon className='h-5 w-5' />
                      <div className='pl-2'>
                        Add New Option
                      </div>
                    </div>
                  </div>
                )
              } else if (inputField.type === "MICROVIVA") {
                return (
                  <div className='bg-white shadow flex flex-col py-5 px-5 mb-5 rounded gap-y-5' key={inputField.id}>
                    <div className='text-lg font-bold border-b-2 pb-5 flex justify-between items-center'>
                      <div className='px-2'>
                        Micro Viva Question
                      </div>
                      <XCircleIcon
                        onClick={() => handleRemoveFields(inputField.id)}
                        className='h-6 w-6 text-flat_red1 hover:text-flat_red2 hover:cursor-pointer'
                      />
                    </div>
                    <div className="w-full flex flex-row items-center gap-x-5 px-2">
                      <div className="w-full flex flex-col gap-y-2">
                        <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                          Marks
                        </label>
                        <input
                          required
                          className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                          type="number"
                          pattern="\d*"
                          step="1"
                          placeholder="Marks"
                          name="marks"
                          value={inputField.marks}
                          onChange={(event) => handleInputOnChange(inputField.id, event)}
                        />
                      </div>
                      <div className="w-full flex flex-col gap-y-2">
                        <label className="flex-grow block text-gray-700 text-sm font-bold mr-3">
                          Time Limit
                        </label>
                        <input
                          required
                          className="appearance-none border rounded w-full py-2 px-3 bg-gray-200 text-gray-700 leading-tight ring focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                          type="number"
                          pattern="\d*"
                          step="1"
                          placeholder="Time Limit in Minutes"
                          name="timeLimit"
                          value={inputField.timeLimit}
                          onChange={(event) => handleInputOnChange(inputField.id, event)}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-2 px-2'>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                      >
                        Question Prompt Audio
                      </label>
                      <div>
                        <ReactMediaRecorder
                          audio
                          onStop={(blobUrl, blob) => handleQuestionAudioChange(blobUrl, blob, inputField.id)}
                          render={({ status, startRecording, stopRecording, clearBlobUrl }) => (
                            <div className="flex flex-row gap-x-2 items-center">
                              <audio className="" src={inputField.questionAudio.blobUrl} controls />
                              <div className="py-2 px-3 flex gap-x-2">
                                {
                                  status === "idle" && (
                                    <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                      <MicrophoneIcon className="h-5 w-5" />
                                      <div className="pl-1">Start</div>
                                    </div>
                                  )
                                }
                                {
                                  status === "stopped" && (
                                    <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                      <MicrophoneIcon className="h-5 w-5" />
                                      <div className="pl-1">Re-Record</div>
                                    </div>
                                  )
                                }
                                {
                                  status === "recording" && (
                                    <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer"
                                      onClick={stopRecording}>
                                      <MicrophoneIcon className="h-5 w-5" />
                                      <div className="pl-1">Stop</div>
                                    </div>
                                  )
                                }
                                {
                                  status === "stopped" && (
                                    <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-4 px-2 rounded text-white font-medium
                                      flex flex-row items-center hover:cursor-pointer"
                                      onClick={() => resetQuestionAudio(clearBlobUrl, inputField.id)}>
                                      <XCircleIcon className="h-5 w-5" />
                                      <div className="pl-1">Clear</div>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-2 px-2'>
                      <label
                        className="block text-gray-700 text-sm font-bold mr-3"
                      >
                        Correct Answer Audio
                      </label>
                      <ReactMediaRecorder
                        audio
                        onStop={(blobUrl, blob) => handleCorrectAudioChange(blobUrl, blob, inputField.id)}
                        render={({ status, startRecording, stopRecording, clearBlobUrl }) => (
                          <div className="flex flex-row gap-x-2 items-center">
                            <audio className="" src={inputField.correctAudio.blobUrl} controls />
                            <div className="py-2 px-3 flex gap-x-2">
                              {
                                status === "idle" && (
                                  <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                    <MicrophoneIcon className="h-5 w-5" />
                                    <div className="pl-1">Start</div>
                                  </div>
                                )
                              }
                              {
                                status === "stopped" && (
                                  <div className="bg-flat_green1 hover:bg-flat_green2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer" onClick={startRecording}>
                                    <MicrophoneIcon className="h-5 w-5" />
                                    <div className="pl-1">Re-Record</div>
                                  </div>
                                )
                              }
                              {
                                status === "recording" && (
                                  <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-4 px-2 rounded text-white font-medium
                                      flex items-center hover:cursor-pointer"
                                    onClick={stopRecording}>
                                    <MicrophoneIcon className="h-5 w-5" />
                                    <div className="pl-1">Stop</div>
                                  </div>
                                )
                              }
                              {
                                status === "stopped" && (
                                  <div className="bg-flat_red1 hover:bg-flat_red2
                                      py-3 px-2 rounded text-white font-medium
                                      flex flex-row items-center hover:cursor-pointer"
                                    onClick={() => resetCorrectAudio(clearBlobUrl, inputField.id)}>
                                    <XCircleIcon className="h-5 w-5" />
                                    <div className="pl-1">Clear</div>
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )
              } else {
                return <div>Unknown Question Type is being added!</div>
              }
            })
          }
          <div className='flex flex-row w-full gap-x-2 mt-5'>
            <div
              onClick={handleAddMcqFields}
              className='flex-grow flex flex-row items-center justify-center
                       bg-flat_gray1 hover:bg-flat_gray2 px-3 py-2 
                       hover:cursor-pointer
                       rounded shadow text-white font-medium'>
              <PlusCircleIcon className='h-5 w-5' />
              <div className='pl-2'>
                Add New MCQ
              </div>
            </div>
            <div
              onClick={handleAddMicroFields}
              className='flex-grow flex flex-row items-center justify-center
                       bg-flat_gray1 hover:bg-flat_gray2 px-3 py-2 
                       hover:cursor-pointer
                       rounded shadow text-white font-medium'>
              <PlusCircleIcon className='h-5 w-5' />
              <div className='pl-2'>
                Add Micro Viva
              </div>
            </div>
          </div>

          <div className='flex flex-row-reverse mr-3 gap-x-2'>
            <Link to={`/examcohorts/${cohortID}/assessments/${assessmentID}/questions`}>
              <div
                className="mt-5 bg-flat_red1 hover:bg-flat_red2 rounded px-3 py-2 text-md text-white font-medium"
              >
                Cancel
              </div>
            </Link>

            <button
              className="mt-5 bg-flat_green1 hover:bg-flat_green2 rounded px-3 py-2 text-md text-white font-medium"
              type='submit'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AddQuestions = () => {
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

export default AddQuestions