
// body onload function
function init_visibility(){
	document.getElementById("dual-map-view").style.display = 'none';
}

// 
function toggle_small_view_visibility(){
	var small_view = document.getElementById("dual-map-view");
	if (small_view.style.display == 'block' || small_view.style.display=='') 
		small_view.style.display = 'none';
    else 
		small_view.style.display = 'block';
}	

	
