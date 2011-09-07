window.onload = function()
{
	init(); // see below, this is to get around global vars not being ready
}
function init()
{
	message_when_searching = 'Searching...';

	passive_search_text_color = '#777';
	active_search_text_color = '#000';
}

function searchFocus()
{
	search_field.style.color = active_search_text_color;
	search_field.value = 'site:paperplanes.de ';
}

