const BASE_URL = 'http://localhost:8000'

window.onload = async() => {
    await loadData()
};

const loadData = async() => {
    console.log('documents page loaded');
    
    const response = await axios.get(`${BASE_URL}/documents`);

    console.log(response.data);

    const userDOM = document.getElementById('documents');
    
    let htmlData = `
    <table border="1">
        <thead>
            <tr>
              <th>ID</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>date_time</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Document</th>
              <th>Note</th>
              <th>Status</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
        </thead>
        <tbody>
    `;

    for(let i = 0; i < response.data.length; i++) {
        let documents = response.data[i];
        htmlData += `
        <tr>
          <td>${documents.id}</td>
          <td>${documents.firstname}</td>
          <td>${documents.lastname}</td>
          <td>${documents.date_time}</td>
          <td>${documents.age}</td>
          <td>${documents.gender}</td>
          <td>${documents.document || '-'}</td>
          <td>${documents.note || '-'}</td>
          <td id="status-${documents.id}">${documents.status || 'รออนุมัติ'}</td> <!-- แสดงสถานะ -->
          <td>
              <a href='index.html?id=${documents.id}'><button>Edit</button></a> 
              <button class='delete' data-id='${documents.id}'>Delete</button> 
          </td>
          <td>
              <button class='approve' data-id='${documents.id}' data-status='อนุมัติ'>อนุมัติ</button>
              <button class='reject' data-id='${documents.id}' data-status='ไม่อนุมัติ'>ไม่อนุมัติ</button>
          </td>
        </tr>
        `;
    } 
    htmlData += '</tbody></table>';
    userDOM.innerHTML = htmlData;

    // Event สำหรับลบ user
    const deleteDOMs = document.getElementsByClassName('delete');
    for(let i = 0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            try {
                await axios.delete(`${BASE_URL}/documents/${id}`);
                loadData(); // โหลดข้อมูลใหม่
            } catch(error) {
                console.log('error', error);
            }
        });
    }

    // Event สำหรับ อนุมัติ และ ไม่อนุมัติ
    const approveDOMs = document.getElementsByClassName('approve');
    for(let i = 0; i < approveDOMs.length; i++) {
        approveDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            const status = event.target.dataset.status;
            await updateStatus(id, status);
        });
    }

    const rejectDOMs = document.getElementsByClassName('reject');
    for(let i = 0; i < rejectDOMs.length; i++) {
        rejectDOMs[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            const status = event.target.dataset.status;
            await updateStatus(id, status);
        });
    }
};

// ฟังก์ชันอัปเดตสถานะ อนุมัติ/ไม่อนุมัติ
const updateStatus = async (id, status) => {
    try {
        await axios.put(`${BASE_URL}/documents/${id}`, { status }); // ส่งค่า status ไปอัปเดต
        document.getElementById(`status-${id}`).innerText = status; // อัปเดต UI ทันที
    } catch (error) {
        console.log('error', error);
    }
};
