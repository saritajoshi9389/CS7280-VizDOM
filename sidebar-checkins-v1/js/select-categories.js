
/* When the user clicks on the button,
 toggle between hiding and showing the dropdown content */
function openCategories() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
		var cityComapareDropdown = document.getElementById("city_compare"); // don't close citycomapre drowndown on click;
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show') && !(openDropdown==cityComapareDropdown)) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

function openComparator(){
	document.getElementById("city_compare").classList.toggle("show");
}

