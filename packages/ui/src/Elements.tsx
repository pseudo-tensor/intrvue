import './globals.css';
import './react-datepicker.css'
import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';

export function Button ({ buttonid, text, handler, loading}) {
  if (typeof(loading) === 'undefined') loading = false;

  return !loading? (
		<div className='flex justify-center duration-200 ease-in hover:bg-periwinkle hover:text-gunmetal'>
			<button id={buttonid} onClick={handler} className='w-full cursor-pointer'>
				<p className='m-4 text-2xl font-light'> {text} </p>
			</button>
		</div>
  ) : (
    <div className='flex justify-center duration-200 ease-in hover:bg-periwinkle hover:text-gunmetal'>
      <button disabled={true} id={buttonid} onClick={handler} className='w-full cursor-pointer'>
        <p className='m-4 text-2xl font-light'> Loading </p>
      </button>
    </div>
  )
}

export function DateTimePicker () { 
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  return (
    <DatePicker
      selected={selectedDateTime}
      onChange={(date) => setSelectedDateTime(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="time"
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
}

