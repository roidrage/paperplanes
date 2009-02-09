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

	message_when_searching = 'Searching...';

	passive_search_text_color = '#777';
	active_search_text_color = '#000';
}

function searchFocus()
{
	search_field.style.color = active_search_text_color;
	search_field.value = 'site:paperplanes.de ';
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
