/* =========================================================================

JavaScript Source File -- Created with SAPIEN Technologies PrimalScript 4.1

NAME: 

AUTHOR: Graham , NA
DATE  : 05/05/2007

COMMENT: Some Javascript for doing some stuff.

============================================================================ */

     
function hide_div(div_id) {
   	mydiv = document.getElementById(div_id)
   	mydiv.style.display = 'none'
}

function show_div(div_id) {
   	mydiv = document.getElementById(div_id)
   	mydiv.style.display = ''
}