function formatNumber (num) {
	num = Math.round(0 + num * 100) / 100;
	return num.toLocaleString('en-GB', { minimumFractionDigits: 2 });
}


function guid () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
		const v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


function timeAgo (date) {
	if (typeof date === 'string') date = new Date(date);
	if (!date) return '';
	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 1 }
	];
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	const interval = intervals.find(i => i.seconds < seconds);
	if (!interval) return 'just now';
	let count = Math.floor(seconds / interval.seconds);
	return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}



function slugify (text) {
	return text.toString().toLowerCase().trim()
		.replace(/&/g, '-and-')         // Replace & with 'and'
		.replace(/[\s\W-]+/g, '-')
		.replace(/-{2,}/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}


/**
 * Make array unique
 * Changes the array in place
 * @param {Array} a - array to make unique
 * @param {*} b     - placeholder
 * @param {*} c     - placeholder
 * @returns {Array} returns the unique array
 */
function unique (a, b, c) {
	b = a.length;
	while (c = --b, c > 0) {
		while (c-- > 0) {
			(a[b] && a[b].id) !== (a[c] && a[c].id) || a.splice(c, 1);
		}
	}
	return a;
}


export {
	formatNumber,
	guid,
	timeAgo,
	slugify,
	unique,
};
