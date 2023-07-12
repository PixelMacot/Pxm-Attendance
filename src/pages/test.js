$("a[href^='/']").each(function()
{
 let orgurl = $(this).attr("href")
 let query = location.search 
 $(this).attr('href',`${orgurl}${query}`)

})