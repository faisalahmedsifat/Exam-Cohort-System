import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

// Moment JS
import moment from 'moment'

// Recorder
import { ReactMediaRecorder } from "react-media-recorder";

// Icons
import { XCircleIcon } from '@heroicons/react/solid';
import { PlusCircleIcon, MicrophoneIcon } from '@heroicons/react/outline';

// Redux
import { useSelector } from 'react-redux'

// Component
import Header from '../Header'
import SidebarForSingleCohort from './SidebarForSingleCohort'

// Services
import cohortService from '../../services/cohortService'
import notification from '../../services/notificationService'
import audioUploadService from '../../services/audioUploadService'

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

const Maincontent = ({ cohortID, cohortName }) => {
  const [inputFields, setInputFields] = useState([])
  const formRef = useRef();
  const navigate = useNavigate();
  const availableDefaultDateCalc = moment(new Date()).format("YYYY-MM-DDTHH:mm");
  const dueDefaultDateCalc = moment(new Date(new Date().setDate(new Date().getDate() + 1))).format("YYYY-MM-DDTHH:mm");

  const currentUser = useSelector(store => store.currentUser.value)

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

  const createAssessment = async () => {
    const currentForm = formRef.current
    const body = {
      name: currentForm['name'].value,
      availableDateTime: new Date(currentForm['availabledatetime'].value).toISOString(),
      dueDateTime: new Date(currentForm['duedatetime'].value).toISOString(),
    }
    const response = await cohortService.addAssessmentToCohort(currentUser.token, cohortID, body)
    return response.assessmentID
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let uploadedFilesDetails = []
    let assessmentID = null;
    try {
      assessmentID = await createAssessment();
      let body = []
      if(inputFields.length === 0) throw new Error("You must add atleast one question to create an assessment!");
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

          const questionAudioFileDetails = {
            fileDir: 'questions/prompt',
            fileName: micQuesAudioID,
            fileExt: 'wav'
          }

          const correctAudioFileDetails = {
            fileDir: 'questions/correct_answer',
            fileName: micCorAudioID,
            fileExt: 'wav'
          }

          uploadedFilesDetails.push(questionAudioFileDetails)
          uploadedFilesDetails.push(correctAudioFileDetails)

          await audioUploadService.uploadAudioFile(currentUser.token, questionAudioFileDetails, question.questionAudio.blob)
          await audioUploadService.uploadAudioFile(currentUser.token, correctAudioFileDetails, question.correctAudio.blob)

          let singleQuestionBody = {
            type: "MICROVIVA",
            marks: Number(question.marks),
            timeLimit: Number(question.timeLimit),
            details: {
              micQuesAudioID: micQuesAudioID,
              micCorAudioID: micCorAudioID,
              micCorAnsText: "TODO"
            }
          }
          body.push(singleQuestionBody)
        }
      }
      if(body.length !== 0) await cohortService.addQuestionToAssessment(currentUser.token, cohortID, assessmentID, body)
      notification.success('Successfully Added!', 2000);
      navigate(`/examcohorts/${cohortID}/assessments/${assessmentID}/questions`)
    } catch (error) {
      for (const detailsOfFiles of uploadedFilesDetails) {
        await audioUploadService.deleteAudioFile(currentUser.token, detailsOfFiles)
      }
      if(assessmentID != null) await cohortService.deleteAssessment(currentUser.token, cohortID, assessmentID);
      notification.error(error.message, 2000);
    }
  }

  return (
    <div className='grow'>
      <Header halfHeader={true} title="Add a new Assessment" />
      <div className='bg-flat_white1 p-10'>
        <div className="flex flex-row items-center justify-between pb-5 border-b-2">
          <div>
            <div className='text-lg text-slate-700'>Creating new Assessment...</div>
            <div className='text-sm text-slate-500'>Fill up the form below with appropiate values.</div>
          </div>
        </div>
        <form ref={formRef}>
          <div className='flex flex-col gap-5 mt-10 mb-10 bg-white rounded shadow
          py-5 px-5'>
            <div className='border-b-2 pb-5'>
              <div className='text-lg text-slate-700 font-semibold'>Assessment Settings</div>
              <div className='text-xs text-slate-500 pt-3'>Provide the assessment name, maximum 20 characters. Also provide the availabled datetime and due date time, the datetime range that the candidates will have access to appear to the assessment. The Candidates <b>MUST</b> finish their assessment during this datetime range. </div>
            </div>
            <div className='flex flex-col gap-y-2'>
              <label htmlFor='name' className='text-slate-600 text-sm tracking-tight font-medium'>Name</label>
              <input maxLength={20} required className='appearance-none border rounded w-full py-2 px-2 bg-gray-100 text-gray-700 leading-tight ring-1 
              focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200' type="text" id="name" />
            </div>
            <div className='flex gap-5'>
              <div className='flex-grow flex flex-col gap-y-2'>
                <label htmlFor='availabledatetime' className='text-slate-600 text-sm tracking-tight font-medium'>Available Datetime</label>
                <div className='flex flex-row gap-x-5'>
                  <input type="datetime-local"
                    className='flex-grow border w-10 rounded py-2 px-3 bg-gray-100 text-gray-700 ring-1 
                focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200'
                    min={availableDefaultDateCalc}
                    defaultValue={availableDefaultDateCalc}
                    name="availabledatetime"
                    id="availabledatetime"
                  />
                </div>
              </div>
              <div className='flex-grow flex flex-col gap-y-2'>
                <label htmlFor='duedatetime' className='text-slate-600 text-sm tracking-tight font-medium'>Due Datetime</label>
                <div className='flex flex-row gap-x-5'>
                  <input type="datetime-local"
                    className='flex-grow border w-10 rounded py-2 px-3 bg-gray-100 text-gray-700 ring-1 
                focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200'
                    min={availableDefaultDateCalc}
                    defaultValue={dueDefaultDateCalc}
                    name="duedatetime"
                    id="duedatetime"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Adding */}


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
                        maxLength="100"
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
                                maxLength="100"
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
            <Link to={`/examcohorts/${cohortID}`}>
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


          {/* Adding */}

        </form>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { cohortID } = useParams()
  const [cohortName, setCohortName] = useState('Cohort');
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
    getCohortName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='w-screen absolute lg:flex'>
      <SidebarForSingleCohort cohortID={cohortID} cohortName={cohortName} />
      <Maincontent cohortID={cohortID} cohortName={cohortName} />
    </div>
  )
}

export default Dashboard