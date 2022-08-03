import React from 'react'

const Option = () => {
  return (
    <div className='flex gap-x-2 items-center'>
      <input type="checkbox" />
      <div>
        Option 1
      </div>
    </div>
  )
}

const ExamArena = () => {
  return (
    <div>
      <div className='flex flex-row-reverse font-bold bg-white rounded px-3 py-3'>
        Time Left: 00:00
      </div>
      <div className='flex flex-col px-20 pt-20'>
        <div className='flex flex-col bg-white rounded text-slate-700 py-5 px-6'>
          <div className='font-medium mb-5 mt-5'>Question Statement Goes Here</div>
          <div>
            <Option />
            <Option />
            <Option />
            <Option />
          </div>
          <div className='flex flex-row-reverse'>
            <div className='hover:cursor-pointer bg-flat_green1 hover:bg-flat_green2 font-medium text-white rounded py-2 px-3'>
              Save & Next
            </div>
          </div>

        </div>
      </div>
    </div>

  )
}

export default ExamArena