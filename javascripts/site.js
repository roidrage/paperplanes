/** $Id: site.js 275 2007-01-11 21:06:20Z garrett $ **/

/**
 * simplelog site functions
 * hides appropriate divs on launch, shows divs, etc, etc
 * search box functionality as well
 */
 
window.onload = function()
{
	init(); // see below, this is to get around global vars not being ready
}
function init()
// init vars, run some initial functions
{
	body_container = document.getElementById('wrapper');
	search_field = document.getElementById('q');
	search_div = document.getElementById('search');
	results_wrapper_div = document.getElementById('search_results');
	loading_msg_span = document.getElementById('loading');
	results_span = document.getElementById('results');
	tag_block = document.getElementById('tags');
	author_block = document.getElementById('authors');

	default_field_value = 'Enter your terms, hit enter';
	message_when_searching = 'Searching...';
	message_when_done = '';
	results_when_searching = '';

	passive_search_text_color = '#777';
	active_search_text_color = '#000';

	isIE = false;

	searchInit(search_field); // capture key events
	clearSearch(); // set everything right with search field / areas
}

function clearSearch()
// clears the search field, sets its default color and value, hides appropriate areas
{
  // search_div.style.display = 'none';
	search_field.style.color = passive_search_text_color;
	search_field.value = default_field_value;
	results_wrapper_div.style.display = 'none';
}
function searchFocus()
{
	search_field.style.color = active_search_text_color;
	if (search_field.value == default_field_value)
	{
		search_field.value = 'site:paperplanes.de ';
	}
}
function showSearch()
{
	if (search_div.style.display == 'block')
	{
		clearSearch();
	}
	else
	{
		search_div.style.display = 'block';
	}
}
