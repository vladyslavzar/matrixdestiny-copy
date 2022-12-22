export const resetForm = (form) => {
    form.querySelector('input[type="text"]').value = '';
    
    form.querySelectorAll('select').forEach(function(e) {
        e.querySelectorAll('option')[0].selected=true;
    })
}