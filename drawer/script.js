let 
	canvas 	= document.getElementById('canvas'),
	ctx 	= canvas.getContext('2d'),
	click	= false,
	coords	= [],
	radius	= 5;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// here we go

canvas.addEventListener('mousedown' , (e) => click = true);
canvas.addEventListener('mouseup' , (e) => {
	click = false;
	ctx.beginPath();
	coords.push('mouseup');
});

ctx.lineWidth = radius * 2;
canvas.addEventListener('mousemove' , (e) => {

	if(click) {
		coords.push([e.clientX , e.clientY]);

		ctx.lineTo(e.clientX , e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX , e.clientY , radius , 0 , Math.PI * 2, false)
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX , e.clientY);
	}
});

function save() {
	localStorage.setItem('coords' , JSON.stringify(coords));
}

function clear() {
	ctx.clearRect(0 , 0 , canvas.width , canvas.height);
	ctx.beginPath();
}

function replay() {
	const timer = setInterval(function() {
		if (!coords.length)
		{
			clearInterval(timer);
			ctx.beginPath();
			return;
		}

		let crd = coords.shift(),
			e = {
				clientX: crd['0'],
				clientY: crd['1']
			};


		ctx.lineTo(e.clientX , e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX , e.clientY , radius , 0 , Math.PI * 2, false)
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(e.clientX , e.clientY);
	} , 5)
}

document.addEventListener('keydown' , (e) => {
	if (e.keyCode == 83)
	{
		// save
		save();
		console.log('Saved');
	}

	if (e.keyCode == 82)
	{
		// replay
		console.log('Replaying ...');

		coords = JSON.parse(localStorage.getItem('coords'));

		clear();
		replay();
	}

	if (e.keyCode == 67)
	{
		// clear
		clear();
		console.log('Canvas is clear :)');
	}
});