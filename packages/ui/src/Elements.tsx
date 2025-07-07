import './globals.css';

export function Button ({text, handler}) {
	return (
		<div>
			<button onClick={handler}>
				<p className='border'> {text} </p>
			</button>
		</div>
	)
}

