import { useState } from 'react'
import { Dialog } from '@headlessui/react'

export default function MyDialog() {
  const [isOpen, setIsOpen] = useState(true)
  const defaultAddCohortForm = { name: "" }
  const [addCohortForm, setAddCohortForm] = useState(defaultAddCohortForm)
  const handleAddNewCohort = (event) => {
    event.preventDefault();
  }

  return (
    <div className='bg-flat_white1 w-screen h-screen'>
      <button
        className=''
        onClick={() => setIsOpen(true)}>
        Open Again
      </button>

      <Dialog as="div"
        className="relative z-50"
        open={isOpen} onClose={() => setIsOpen(false)}>

        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <form onSubmit={handleAddNewCohort}>
          <div className='fixed inset-0 flex items-center justify-center'>
            <Dialog.Panel className="mx-auto max-w-md w-full rounded bg-white">
              <Dialog.Title className="text-lg font-bold px-3 pt-4">Add a new Exam Cohort</Dialog.Title>
              <Dialog.Description className="px-3 py-10 flex items-center justify-center">
                <label class="block text-gray-700 text-sm font-bold mr-3" for="newCohortName">
                  Name
                </label>
                <input maxLength={10} required class="appearance-none border rounded w-full py-2 px-3 bg-gray-200
               text-gray-700 leading-tight
               ring
               focus:outline-none focus:shadow-outline focus:ring-flat_blue1 focus:bg-gray-200"
                  id="newCohortName" type="text" placeholder="Exam Cohort Name" />
              </Dialog.Description>
              <div className='flex flex-row items-center justify-end gap-5 pb-5 pr-5'>
                <button type="submit" className="bg-flat_green1 hover:bg-flat_green2 py-2
            text-white text-md rounded-md px-5">Add</button>
                <button className="bg-flat_red1 hover:bg-flat_red2 py-2
            text-white text-md rounded-md px-5" onClick={() => setIsOpen(false)}>Cancel</button>
              </div>
            </Dialog.Panel>
          </div>
        </form>

      </Dialog>
    </div>
  )
}
