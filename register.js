const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // default mode
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);

    let date_timeDOM = document.querySelector('input[name=date_time]');
    if (date_timeDOM) {
        let now = new Date();
        let thailandTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        let formattedDateTime = thailandTime.toISOString().slice(0, 16);
        date_timeDOM.value = formattedDateTime;
    }

    if (id) {
        mode = 'EDIT';
        selectedId = id;

        try {
            const response = await axios.get(`${BASE_URL}/documents/${id}`);
            const documents = response.data;

            document.querySelector('input[name=firstname]').value = documents.firstname;
            document.querySelector('input[name=lastname]').value = documents.lastname;
            document.querySelector('input[name=age]').value = documents.age;
            document.querySelector('textarea[name=note]').value = documents.note || '';

            // ✅ แก้ไขโค้ดการตั้งค่าเพศ (Gender)
            let genderDOMs = document.querySelectorAll('input[name=gender]');
            genderDOMs.forEach(genderInput => {
                if (genderInput.value === documents.gender) {
                    genderInput.checked = true;
                }
            });

            // ✅ กำหนดค่าให้กับ "ประเภทเอกสาร" (Document Type)
            let documentDOMs = document.querySelectorAll('input[name=document]');
            documentDOMs.forEach(documentInput => {
                if (documents.document.includes(documentInput.value)) {
                    documentInput.checked = true;
                }
            });

        } catch (error) {
            console.log('error', error);
        }
    }
};

const validateData = (documentsData) => {
    let errors = [];
    if (!documentsData.firstName) {
        errors.push('-- กรุณากรอกชื่อ --');
    }
    if (!documentsData.lastName) {
        errors.push('-- กรุณากรอกนามสกุล --');
    }
    if (documentsData.document.length === 0) {
        errors.push('-- กรุณาเลือกประเภทเอกสาร --');
    }
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOMs = document.querySelectorAll('input[name=gender]:checked');
    let documentDOMs = document.querySelectorAll('input[name=document]:checked');
    let noteDOM = document.querySelector('textarea[name=note]');
    let messageDOM = document.getElementById('message');

    try {
        let gender = genderDOMs.length > 0 ? genderDOMs[0].value : 'อื่นๆ';
        let documentsSelected = Array.from(documentDOMs).map(doc => doc.value);

        let documentData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value ? parseInt(ageDOM.value) : 0,
            gender: gender,
            note: noteDOM.value,
            document: documentsSelected
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
            window.location.href = "status.html";
        }, 300);

        messageDOM.innerText = message;
        messageDOM.className = 'message success';
    } catch (error) {
        console.log('error message', error.message);
        console.log('error', error.errors);

        if (error.response) {
            console.log("err.response", error.response.data.message);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        let htmlData = '<div>';
        htmlData += `<div> ${error.message} </div>`;
        htmlData += '<ul>';
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li> ${error.errors[i]} </li>`;
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};
