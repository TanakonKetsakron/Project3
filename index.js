const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE' // default mode
let selectedId = ''

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  console.log('id', id)
  
  if (id) {
    mode = 'EDIT'
    selectedId = id
    
    try {
      const response = await axios.get(`${BASE_URL}/documents/${id}`)
      const documents = response.data

      let firstNameDOM = document.querySelector('input[name=firstname]');
      let lastNameDOM = document.querySelector('input[name=lastname]');
      let ageDOM = document.querySelector('input[name=age]');
      let documentDOM = document.querySelector('input[name=document]');
      let noteDOM = document.querySelector('textarea[name=note]');
      
      firstNameDOM.value = documents.firstname
      lastNameDOM.value = documents.lastname
      ageDOM.value = documents.age
      documentDOM.value = documents.document
      noteDOM.value = documents.note

       
      let documentDOMs = document.querySelector('input[name=document]:checked');
      
      
      
      for (let i = 0; i < genderDOM.length; i++) {
        if (genderDOM[i].value == documents.gender) {
          genderDOM[i].checked = true
        }
      } 
        for (let i = 0; i < documentDOM.length; i++) {
          if (documents.document.includes(documentDOMs[i].value)) {
            documentDOMs[i].checked = true
          }
      }

    } catch (error) {
      console.log('error', error)
    }
  }
}

const validateData = (documentsData) => {
  let errors = []
  if (!documentsData.firstName) {
    errors.push('-- กรุณากรอกชื่อ  --')
  }
  if (!documentsData.lastName) {
    errors.push('-- กรุณากรอกนามสกุล  --')
  }
  if (documentsData.document.length === 0) {
    errors.push('-- กรุณาเลือกประเภทเอกสาร    --')
  }
  return errors
}

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked');
    let documentDOMs = document.querySelector('input[name=document]:checked')// แก้ไขให้ตรงกับชื่อใน HTML
    let noteDOM = document.querySelector('textarea[name=note]');
    let messageDOM = document.getElementById('message');
  
    try {
        let gender = genderDOM ? genderDOM.value : 'อื่นๆ';
        let document = documentDOMs  ? documentDOMs.value : '';
        
  
        let documentData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value ? parseInt(ageDOM.value) : 0,
            gender: gender,
            note:noteDOM.value,
            document: document
        };
  
        console.log('submitData', documentData);

    
  
        const errors = validateData(documentData);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบถ้วน', errors: errors };
        }
  
        let message = 'บันทึกข้อมูลเรียบร้อยแล้ว';
        if (mode === 'CREATE') {
            const response = await axios.post(`${BASE_URL}/documents`, documentData);
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/documents/${selectedId}`, documentData);
            message = 'แก้ไขข้อมูลเรียบร้อยแล้ว';
            console.log('response', response.data);
        }
  
          setTimeout(() => {
      window.location.href = "users.html";
    }, 300);

    messageDOM.innerText = message
    messageDOM.className = 'message success'
  } catch (error) {
    console.log('error message', error.message);
    console.log('error', error.errors);
    
    if (error.response) {
      console.log("err.response",error.response.data.message);
      error.message = error.response.data.message
      error.errors = error.response.data.errors
    }

    let htmlData = '<div>'
    htmlData += `<div> ${error.message} </div>`;
    htmlData += '<ul>'
    for (let i = 0; i < error.errors.length; i++) {
      htmlData += `<li> ${error.errors[i]} </li>`
    }
    htmlData += '</ul>'
    htmlData += '</div>'

    messageDOM.innerHTML = htmlData
    messageDOM.className = 'message danger'
  }

}
