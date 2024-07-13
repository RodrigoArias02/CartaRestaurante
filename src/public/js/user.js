let btn = document.getElementById("btn-enviar")

btn.addEventListener("click",async()=>{
    const user=document.getElementsByName("userText")[0].value;
    const password=document.getElementsByName("passwordText")[0].value;
    console.log(user)
    console.log(password)
    const formData={
        user,
        password
    }

    try {
        // Enviar datos al servidor y esperar la respuesta
        const response = await fetch(`/logueo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
         
        });
    
        // Parsear la respuesta como JSON
        const data = await response.json();
        
        if(data.status=="201"){
        alert(data.message)
        
        }else{
          alert(data.error)
        }
  
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
})