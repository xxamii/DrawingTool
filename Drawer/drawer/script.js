let 
	canvas 	= document.getElementById('canvas'),
	ctx 	= canvas.getContext('2d'),
	click	= false,
	coords	= [],
	radius	= 5,
	colors	= document.getElementsByClassName('color'),
	sizes	= document.getElementsByClassName('size');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight - window.innerHeight / 10;

// Code

function check() {
	click = true;
}


canvas.addEventListener('focusout' , (e) => ctx.beginPath());
canvas.addEventListener('mousedown' , check);
document.addEventListener('mouseup' , (e) => {
	click = false;
	ctx.beginPath();
	coords.push('mouseup');
});

ctx.lineWidth = radius * 2;
canvas.addEventListener('mousemove' , (e) => {

	if(click) {
		coords.push([e.clientX , e.clientY , ctx.fillStyle , ctx.strokeStyle , radius]);

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

	canvas.removeEventListener('mousedown' , check);

	const timer = setInterval(function() {
		if (!coords.length)
		{
			clearInterval(timer);
			ctx.beginPath();
			canvas.addEventListener('mousedown' , check);
			return;
		}

		let crd = coords.shift(),
			e = {
				clientX: crd['0'],
				clientY: crd['1'],
				strokeColor: crd['2'],
				fillColor: crd['3'],
				size: crd['4']
			};

		ctx.fillStyle = e.fillColor;
		ctx.strokeStyle = e.strokeColor;
		ctx.lineWidth = e.size * 2;


		ctx.lineTo(e.clientX , e.clientY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(e.clientX , e.clientY , e.size , 0 , Math.PI * 2, false)
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

Array.prototype.forEach.call(colors , (elem) => {
	elem.addEventListener('click' , () => {
		let attr = elem.getAttribute('data-color');
		ctx.fillStyle = attr;
		ctx.strokeStyle = attr;
	})
});

Array.prototype.forEach.call(sizes , (elem) => {
	elem.addEventListener('click' , () => {
		let attr = elem.getAttribute('data-size');
		radius = +attr / 2;
		ctx.lineWidth = radius * 2;
	})
});