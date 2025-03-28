const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');


const port = 8000;

app.use(bodyParser.json());

app.use(cors());

let documents = []

let conn=null

const initMySQL = async () => {
   conn= await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8822
  
  })
}
const validateData = (userData) => {
  let errors = []
  if (!userData.firstName) {
    errors.push ('กรุณากรอกชื่อ')
  }
  if (!userData.lastName) {
    errors.push ('กรุณากรอกนามสกุล')
  }
 
 
  if (!userData.document) {
    errors.push ('กรุณาเลือกความสนใจ')
  }
  
  return errors
}

/*app.get('/testdbnew',async (req, res) => {

  try{
    const results = await conn.query('SELECT * FROM user')
    res.json(results[0])
  } catch (error) { 
    console.log('error', error.message)
        res.status(500).json({error: 'Error fetching users'}) 

  }
})*/
/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /user สำหรับสร้าง user ใหม่
GET /users/:id สำหรับ ดึง users รายคนออกมา
PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /users/:id สำหรับลบ users รายคน ตาม id ที่บันทึกเข้าไป) 

*/
// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/documents',async (req, res) => {
  const results = await conn.query('SELECT * FROM documents')
  res.json(results[0])
})

// path = POST /user สำหรับสร้าง user ใหม่
app.post('/documents',async (req, res) => {
 
  try{
    let documents = req.body;
    const errors = validateData(documents)
    if (errors.length > 0) {
      throw {
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        errors: errors
      }
    }
    const results= await conn.query('INSERT INTO documents SET ?', documents)
    res.json({
      message: 'Create documents successfully',
      data: results[0]
    }) 
  }catch(error){
    const errorMesssage = error.message || 'something went wrong'
    const errors = error.errors || []
    console.error('error:', error.message)
    res.status(500).json({
      message: errorMesssage,
      errors: errors,
    })
  }
}) 

// path = GET /users/:id สำหรับ ดึง users รายคนออกมา
app.get('/documents/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query('SELECT * FROM documents WHERE id = ?', id)
    if (results[0].length == 0) {
      throw{ statusCode: 404, message: 'documents not found'}
    }
      res.json(results[0][0])
     
    } catch (err) {
      console.log('error', err.message)
      let statusCode = err.statusCode || 500
      res.status(500).json({
        message: 'something went wrong',
        errorMesssage: err.message
      })
  } 
}) 

// path: PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/documents/:id',async (req, res) => {

  try{
    let id = req.params.id;
    let updateUser = req.body;
    const results= await conn.query(
      'UPDATE documents SET ? WHERE id=?', 
      [updateUser, id]
    )
    res.json({
      message: 'Update documents successfully',
      data: results[0]
    }) 
  }catch(err){
    res.status(500).json({
      message: 'something went wrong',
      errorMesssage: err.message
    })
  }
})

//path: DELETE /users/:id สำหรับลบ users รายคน ตาม id ที่บันทึกเข้าไป)
app.delete('/documents/:id',async (req, res) => {
  try{
    let id = req.params.id;
    const results= await conn.query('DELETE from documents WHERE id=?',id)
    res.json({
      message: 'Delete documents successfully',
      data: results[0]
    }) 
  }catch(err){
    console.log('error', err.message)
    res.status(500).json({
      message: 'something went wrong',
      error: err.message
    })
  }
})
  app.listen(port,async (req,res) => {
    await initMySQL()
    console.log('http server is running on port'+port)
  })