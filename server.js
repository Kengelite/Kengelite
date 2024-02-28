const express = require('express');
const bodyParser = require('body-parser');
// const mysql = require('mysql');
const admin = require('firebase-admin');
const app = express();
const mqtt = require('mqtt');
app.use(bodyParser.json());
const axios = require('axios');
const querystring = require('querystring');
const healthcheck = require('express-healthcheck');

const serviceAccount = require('./projectjop-86653-firebase-adminsdk-riay7-b1a0545395.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectjop-86653-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db_fb = admin.database();

// const client = mqtt.connect('mqtt://20.51.151.48', {
//   clientId: '',
//   // clientId: 'clientId-26xlboL1v4', // ระบุ ID ของ client ที่ไม่ซ้ำกัน
//   username: '', // ระบุชื่อผู้ใช้งาน (หากต้องการ)
//   password: '', // ระบุรหัสผ่าน (หากต้องการ)
//   port:'1883'
// });
// client.on('connect', () => {
//   console.log('Connected to HiveMQ broker');

//   // สมัครสมาชิกในหัวข้อที่ต้องการรับข้อมูล
//   client.subscribe('car_wash/box_car1');
// });
const mysql = require('mysql2/promise');
// const brokerUrl = 'mqtt://172.191.134.80'; // URL ของ Mosquitto broker
// const client = mqtt.connect(brokerUrl);


// เมื่อเชื่อมต่อกับ broker สำเร็จ
// client.on('connect', () => {
//   console.log('Connected to Mosquitto broker');

//   // ทำการ subscribe ไปยัง topic ที่ต้องการ
//   client.subscribe('WashCar/kkn/box1');
//   client.subscribe('WashCar/kkn/box1/backmsg');
//   client.subscribe('WashCar/kkn/box1/backid');
// });
// client.on('message', (topic, message) => {

//   // if(message.toString() == "" ){
//   //   console.log("หมดเวลา")
//   // }
//   if (topic === 'WashCar/kkn/box1/backmsg') {
//     console.log('Received message:', message.toString());
//     // ทำอย่างอื่น ๆ ที่คุณต้องการทำกับข้อมูลที่ได้รับ
//   }
//   console.log(`Received message on topic ${topic}: ${message.toString()}`);
// });

// ทำการ publish ข้อความไปยัง topic ที่ต้องการ


///ทดสอบ-*-----------------------------------------------------------------------------
// เมื่อได้รับข้อมูลใหม่จาก HiveMQ broker
// client.on('message', function (topic, message) {
//   console.log('Received message d:', topic.toString());
//   if (topic === 'WashCar/kkn/box1/backmsg') {
//     console.log('Received message:', message.toString());
//     // ทำอย่างอื่น ๆ ที่คุณต้องการทำกับข้อมูลที่ได้รับ
//   }
// });
/*
app.get('/test_mqtt', (req, res) => {
  // ส่งข้อมูลไปยัง HiveMQ broker
  client.publish('car_wash/box_car1', 'on');
  let data_t;

  // อ่านค่าจากโหนด '/credit_balance'
 
  db_fb.ref('/testmqtt').on('value', (snapshot)  => {
    const data = snapshot.val();
    data_t = data;
    console.log('Received data:', data);
  });
  while (data_t == 0) {
    client.publish('car_wash/box_car1', 'on');
    db_fb.ref('/testmqtt').on('value', (snapshot)  => {
      const data = snapshot.val();
      data_t = data;
      console.log('Received data:', data);
    });
  }
  console.log('Received data:', "เปิดสำเร็จ");
  // client.on('message', function (topic, message) {
  //   console.log('Received message:', topic.toString());
  //   if (topic === 'car_wash/status') {
  //     console.log('Received message:', message.toString());
  //     // ทำอย่างอื่น ๆ ที่คุณต้องการทำกับข้อมูลที่ได้รับ
  //   }
  // });
})
app.get('/test_mqttf', (req, res) => {
  // ส่งข้อมูลไปยัง HiveMQ broker
  client.publish('car_wash/box_car1', 'off');

  client.on('message', function (topic, message) {
    console.log('Received message:', topic.toString());
    if (topic === 'car_wash/status') {
      console.log('Received message:', message.toString());
      // ทำอย่างอื่น ๆ ที่คุณต้องการทำกับข้อมูลที่ได้รับ
    }
  });
})*/
///ทดสอบ-*-----------------------------------------------------------------------------
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'projectjop'
// });

// const mysql = require('mysql');
// ******************************************************************************
app.use('/health', healthcheck());
app.get('/add_fb', (req, res) => {
  db_fb.ref('/credit_balance').set(10).then(() => {
    res.status(200).json({ 'success': true, 'message': 'insert data successs' });
  }).catch((error) => {
    console.error('Error:', error);
  });
})


const db = mysql.createPool({
  host: '119.59.96.62',
  user: 'drchanon',
  password: 'nonahcrd123',
  database: 'LAB_DB',
  port: '3306',
  waitForConnections: true,
  queueLimit: 0
});

app.get('/', (req, res) => {
  return res.send({
    error: true,
    message: "Test API"
  })
})


// app.post('/mosmqtt', (req, res) => {
//   res.status(200).json({ 'success': true, 'message': 'insert data successs' });
//   client.publish('WashCar/kkn/box1', req.body.mqtt);
// })




app.post('/controller_box', (req, res) => {
  console.log(req.body.control)
  let txt = "/box" + req.body.id_box + "/working_now"
  if (req.body.control == '0') {
    db_fb.ref(txt).set(parseInt(req.body.control)).then(() => {
      db_fb.ref("/box" + req.body.id_box + "/working_new").set(1).then(() => {
        db_fb.ref("/box" + req.body.id_box + "/working_state").set(0).then(() => {
          res.status(200).json({ 'ok': true, 'message': 'insert data successs' });
        }).catch((error) => {
          console.error('Error:', error);
        });
      }).catch((error) => {
        console.error('Error:', error);
      });
    }).catch((error) => {
      console.error('Error:', error);
    });
  } else {
    db_fb.ref(txt).set(parseInt(req.body.control)).then(() => {
      db_fb.ref("/box" + req.body.id_box + "/working_new").set(1).then(() => {
        res.status(200).json({ 'ok': true, 'message': 'insert data successs' });
      }).catch((error) => {
        console.error('Error:', error);
      });
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  // res.status(200).json({ 'success': true, 'message': 'insert data successs' });
  // client.publish('WashCar/kkn/box1', req.body.control);
})


app.post('/controller_box_error', (req, res) => {
  console.log(req.body.control)
  let txt = "/box" + req.body.id_box + "/working_now"
  if (req.body.control == '0') {
    db_fb.ref(txt).set(0).then(() => {
      db_fb.ref("/box" + req.body.id_box + "/working_new").set(0).then(() => {
        db_fb.ref("/box" + req.body.id_box + "/working_state").set(0).then(() => {
          db_fb.ref("/box" + req.body.id_box + "/credit_balance").set(0).then(() => {
            res.status(200).json({ 'ok': true, 'message': 'insert data successs' });
          }).catch((error) => {
            console.error('Error:', error);
          });
        }).catch((error) => {
          console.error('Error:', error);
        });
      }).catch((error) => {
        console.error('Error:', error);
      });
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  // res.status(200).json({ 'success': true, 'message': 'insert data successs' });
  // client.publish('WashCar/kkn/box1', req.body.control);
})

app.post('/testapi5', async (req, res) => {
  try {
    // ทำสิ่งที่ต้องการเมื่อเรียกใช้ `/testapi`

    // เริ่มต้นการยิง request ทุก 1 นาทีเป็นเวลา 5 นาที
    const interval = setInterval(async () => {
      // ส่วนที่ต้องการทำงานทุก 1 นาที
      // ใส่โค้ดที่ต้องการทำซ้ำทุก 1 นาทีที่นี่
      const username = '9Mxu2AzU8clkSxfNnDvX5NwxC9jAJz1g';
      const password = '';
      const auth = Buffer.from(`${username}:${password}`).toString('base64');

      const requestData = {
        referenceNo: 'WESDSS55279',
        // เพิ่มข้อมูล JSON object ที่ต้องการส่งไป
      };

      axios
        .post('https://api.gbprimepay.com/v1/check_status_txn', requestData, {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const responseData = response.data;
          console.log(responseData);
          console.log(responseData.resultMessage);
        })
        .catch((error) => {
          console.error(error);
        });

      // ตรวจสอบเวลาว่าผ่านไปเกิน 5 นาทีหรือไม่
      if (Date.now() - startTime >= 10 * 60 * 1000) {
        clearInterval(interval); // หยุดการทำงานซ้ำ
        const responseData = await fetchData(); // ดึงข้อมูลที่ต้องการ
        res.send(responseData); // ส่งข้อมูลกลับไปยัง client
      }
      // ทำการเช็คทุก 10 วินาที 
    }, 1 * 5 * 1000); // 1 นาที (60 วินาที)

    const startTime = Date.now(); // เวลาเริ่มต้น

    // เพื่อให้รอการทำงานซ้ำที่ setInterval ในขณะที่รอให้ครบ 5 นาที
    await new Promise((resolve) => {
      // 5  * 60 * 1000 = 300,000 มิลลิวิทนาที => หารด้วย 1000 เพื่อหา วินาที => 300 วินาที / 60 วินาที  => 5 นาที 
      setTimeout(resolve, 5 * 60 * 1000); // 5 นาที (300 วินาที)  = 
    });
    clearInterval(interval); // หยุดการทำงานซ้ำ
    res.sendStatus(200); // ส่งสถานะการตอบกลับ 200 OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/testapi1', async (req, res) => {
  try {
    let date = new Date().getTime();
    console.log(("WC" + date.toString()).length)
    // res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
})


app.post('/create_qrcode_payment', async (req, res) => {
  console.log(req.body.username)
  try {
    // แปลงข้อมูลให้เป็นรูปแบบ x-www-form-urlencoded จาก json
    let date = new Date().getTime();
    console.log(date.toString().length)
    const formData = querystring.stringify({
      token: 'gpv2ca2Q0TfMuIcI6iCWsT9J85YmL8jTwObgjkYImMa3coCIVIqYNro2SAOKkMEmlA2y0pi/jgQIOiWa9giI9h+ONbXo3+RdMLVWqL6QiwYbHeeVYStYST2bLMjCW8/1m1VulGi7KWWFSkRrJJgzdPrv6HDiIH2AjUhQgrYUXGzenGSi',
      amount: req.body.amount,
      referenceNo: date
    });

    // ตัวเลือกสำหรับ HTTP POST request
    const options = {
      method: 'POST',
      url: 'https://api.gbprimepay.com/v3/qrcode/text',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    };

    // // ทำ HTTP POST request ไปยัง URL อื่น
    // const response = await axios(options);

    // // ดึงข้อมูลที่ต้องการจาก response
    // const data = response.data;

    // // ส่งข้อมูลกลับไปยัง client

    // res.send(data).then(async () => {
    //   console.log(data)
    axios(options)
      .then(async response => {
        const data = response.data;
        console.log(data);
        res.send({ ok: true, data: data });
        console.log("----------------------------------")
        try {

          // เริ่มต้นการยิง request ทุก 1 นาทีเป็นเวลา 5 นาที
          const interval = setInterval(async () => {
            // ส่วนที่ต้องการทำงานทุก 1 นาที
            // ใส่โค้ดที่ต้องการทำซ้ำทุก 1 นาทีที่นี่
            const username = '9Mxu2AzU8clkSxfNnDvX5NwxC9jAJz1g';
            const password = '';
            const auth = Buffer.from(`${username}:${password}`).toString('base64');

            const requestData = {
              referenceNo: date
              // เพิ่มข้อมูล JSON object ที่ต้องการส่งไป
            };
            axios.post('https://api.gbprimepay.com/v1/check_status_txn', requestData, {
              headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
              },
            })
              .then(async (response) => {
                const responseData = response.data;
                console.log(responseData);
                // console.log(responseData.txns.length());
                // console.log('customerName' in responseData.txn);
                // 'status' in responseData.txn && 
                if (responseData.txn.status == 'S') {
                  clearInterval(interval);
                  try {
                    await db.query(`INSERT INTO  payment (number_reference, total, status_payment, gbpReferenceNo, point_payment , type_payment, email_cus)
                    VALUES  (?,?,?,?,?,?,?)`,
                      [
                        responseData.txn.referenceNo,
                        responseData.txn.totalAmount,
                        responseData.txn.status,
                        responseData.txn.gbpReferenceNo,
                        (parseInt(responseData.txn.totalAmount) * 0.05).toFixed(2),
                        responseData.txn.paymentType,
                        req.body.username
                      ]);
                    //  ดึงข้อมูลลูกค้ามาบวกค่าใหม่
                    const [results_customer_update] = await db.query(`select * from customer where username = ?`, req.body.username);
                    // let money_customer = parseInt(results_customer_update[0].money) + parseInt(responseData.txn.totalAmount)
                    const [results_credit] = await db.query(`select * from credit where  status = 1  `);
                    let money_customer = parseInt(results_customer_update[0].money) + (results_credit[0].credit_point * parseFloat(responseData.txn.totalAmount))
                    // บวกคะแนนพ้อย
                    console.log(money_customer);
                    let point_customer = parseFloat(results_customer_update[0].point) + (parseFloat(responseData.txn.totalAmount) * 0.05)
                    console.log(point_customer);
                    await db.query(`UPDATE  customer SET  money = ? , point = ?
                    WHERE  username = ?`,
                      [
                        money_customer,
                        point_customer,
                        req.body.username
                      ]);
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
                  }
                }
                // if(responseData.txns != undefined){
                //   if(responseData.txn.customerName != undefined){
                //     console.log(responseData.txns);
                //     clearInterval(interval); 
                //     res.sendStatus(200); 
                //   }
                // }
              })
              .catch((error) => {
                console.error(error);
              });

            // ตรวจสอบเวลาว่าผ่านไปเกิน 3 นาทีหรือไม่
            if (Date.now() - startTime >= 10 * 30 * 1000) {
              clearInterval(interval); // หยุดการทำงานซ้ำ
              const responseData = await fetchData(); // ดึงข้อมูลที่ต้องการ
              // res.send(responseData); // ส่งข้อมูลกลับไปยัง client
            }
            // ทำการเช็คทุก 10 วินาที 
          }, 1 * 10 * 1000); // 1 นาที (60 วินาที)

          const startTime = Date.now(); // เวลาเริ่มต้น

          // เพื่อให้รอการทำงานซ้ำที่ setInterval ในขณะที่รอให้ครบ 5 นาที
          await new Promise((resolve) => {
            // 5  * 60 * 1000 = 300,000 มิลลิวิทนาที => หารด้วย 1000 เพื่อหา วินาที => 300 วินาที / 60 วินาที  => 5 นาที 
            setTimeout(resolve, 5 * 60 * 1000); // 5 นาที (300 วินาที)  = 
          });
          clearInterval(interval); // หยุดการทำงานซ้ำ
          // res.sendStatus(200); // ส่งสถานะการตอบกลับ 200 OK
        } catch (error) {
          console.error(error);
          // res.sendStatus(200);
        }
      })
      .catch(error => {
        console.error(error);
        // res.sendStatus(200);
      });

    // });
  } catch (error) {
    console.error(error);
    res.sendStatus(200);
  }
});




app.get('/customer', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [results, fields] = await connection.query(`select * from customer where username = 'aaa@aa'`);
    connection.release();
    // const [results] = await db.query(`select * from customer where username = 'aaa@aa'`);
    res.send(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
})
app.post('/check_customer', async (req, res) => {
  // console.log(req.body)
  // connection.query('select * from customer where  username = ?  and password = ? and delete_time IS NULL', [req.body.username, req.body.password], (error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log(results.length)
  //     if (results.length == 0) {
  //       res.send({ ok: false, data: results });
  //     } else {
  //       res.send({ ok: true, data: results });
  //     }
  //   }
  console.log(req.body.username)
  try {
    const [results] = await db.query(`select * from customer where  username = ?  and password = ? and delete_time IS NULL`, [req.body.username, req.body.password]);
    if (results.length == 0) {
      res.send({ ok: false, data: results });
    } else {
      res.send({ ok: true, data: results });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
  // if(results.length())
  // res.json({ ok: true ,data:results}) 
  // });
})

app.post('/data_customer', async (req, res) => {
  try {
    const [results] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`, [req.body.username]);
    const [results_credit_now] = await db.query(`select * from credit where delete_time IS NULL`,);
    if (results.length == 0) {
      res.send({ ok: false, data: results });
    } else {
      res.send({ ok: true, data: results, results_credit_now });
      console.log("ture")
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
  // console.log(req.body)
  // connection.query('select * from customer where  username = ?  and delete_time IS NULL', [req.body.username], (error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log(results.length)
  //     if (results.length == 0) {
  //       res.send({ ok: false, data: results });
  //     } else {
  //       res.send({ ok: true, data: results });
  //       console.log("ture")
  //     }
  //   }
  //   // res.json({ ok: true ,data:results}) 
  // });
})


app.put('/editCustomer', async (req, res) => {

  try {
    const [results_up] = await db.query(`UPDATE customer SET fname = ? , lname = ?, tel = ?   where  username = ? and delete_time IS NULL`,
      [req.body.fname, req.body.lname, req.body.tel, req.body.username]);

    const [results] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`,
      [req.body.username]);
    res.send({ ok: true, data: results });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, data: results });
  }
  // console.log(req.body)
  // connection.query('UPDATE customer SET fname = ? , lname = ?, tel = ?   where  username = ? and delete_time IS NULL', [req.body.fname, req.body.lname, req.body.tel, req.body.username], (error, results) => {
  //   if (error) {
  //     console.log('555')
  //     res.send({ ok: false, data: results });
  //     throw error;
  //   } else {
  //     console.log('58885')
  //     connection.query('select * from customer where  username = ?  and delete_time IS NULL', [req.body.username], (error, results) => {
  //       if (error) throw error;
  //       res.send({ ok: true, data: results });
  //     });
  //   }
  //   // if(results.length())

  //   // res.json({ ok: true ,data:results}) 
  // });
})


app.post('/data_usecar', async (req, res) => {

  try {
    const [results] = await db.query(`select * from use_car_wash where email_cus  = ?  and delete_time IS NULL ORDER BY create_time DESC`, [req.body.username]);
    if (results.length == 0) {
      res.send({ ok: false, data: results });
    } else {
      res.send({ ok: true, data: results });
      console.log("ture")
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
  // console.log(req.body)
  // connection.query('select * from use_car_wash where email_cus  = ?  and delete_time IS NULL  ', req.body.username, (error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log(results.length)
  //     if (results.length == 0) {
  //       res.send({ ok: false, data: results });
  //     } else {
  //       res.send({ ok: true, data: results });
  //       console.log("ture")
  //     }
  //   }
  //   // if(results.length())

  //   // res.json({ ok: true ,data:results}) 
  // });
})

app.post('/data_payment', async (req, res) => {
  console.error(req.body.username);
  try {
    const [results] = await db.query(`select * from payment where email_cus  = ? and delete_time IS NULL`, [req.body.username]);
    console.error(results);
    if (results.length == 0) {
      res.send({ ok: false, data: results });
    } else {
      res.send({ ok: true, data: results });
      console.log("ture")
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
  // console.log(req.body)
  // connection.query('select * from payment where email_cus  = ? and delete_time = "N"', req.body.username, (error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log(results.length)
  //     if (results.length == 0) {
  //       res.send({ ok: false, data: results });
  //     } else {
  //       res.send({ ok: true, data: results });
  //       console.log("ture")
  //     }
  //   }
  //   // if(results.length())

  //   // res.json({ ok: true ,data:results}) 
  // });
})

app.post('/usersadd', async (req, res) => {

  try {
    const [results_check] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`,
      [req.body.username, req.body.password]);

    if (results_check.length == 0) {
      const [results_insert] = await db.query(`INSERT INTO customer(username,fname,lname,password,money,point,img,tel) VALUES (?,?,?,?,?,?,?,?) `,
        [req.body.username, req.body.fname, req.body.lname, req.body.password, 0, 0, "images/profile_start.png", req.body.tel]);
      console.log(results_insert);
      const [results] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`,
        [req.body.username]);
      res.send({ ok: true, data: results });

    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false });
  }


  // console.log(req.body)
  // connection.query('select * from customer where  username = ?  and delete_time IS NULL', [req.body.username, req.body.password], (error, results) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     console.log(results.length)
  //     if (results.length == 0) {
  //       connection.query('INSERT INTO customer SET ? ', req.body, (error, results) => {
  //         if (error) throw error
  //         connection.query('select * from customer where  username = ?  and delete_time IS NULL', [req.body.username], (error, results) => {
  //           res.send({ ok: true, data: results });
  //         });
  //       });
  //     } else {
  //       res.send({ ok: false, data: results });
  //     }
  //   }
  // });
  // if(results.length())

});
app.post('/branch_location', async (req, res) => {
  console.log(req.body.longi, req.body.lati)
  try {
    const [results] = await db.query(`SELECT latitude,longitude,name_branch,id_branch
    FROM branch
    WHERE ST_Distance_Sphere(POINT(branch.longitude,branch.latitude), POINT(?,?)) < 5000 and id_branch != 0 and delete_time IS NULL `, [req.body.longi, req.body.lati]);
    res.status(200).json({ 'success': true, results: results });
    console.log(results)
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
})



app.post('/branch_data_car', async (req, res) => {
  console.log(req.body.branch_id)
  try {
    const [results] = await db.query(`SELECT * FROM car_wash 
    left join branch on car_wash.branch_id = branch.id_branch
    WHERE branch_id = ?`, [req.body.branch_id]);
    // res.send(results);
    res.status(200).json({ 'success': true, results: results });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 'success': false, 'message': 'Internal server error' });
  }
})

app.post('/addcomment', async (req, res) => {
  try {
    const [results_insert] = await db.query(`INSERT INTO report_problem(comment) VALUES (?) `,
      [req.body.comment]);
    res.send({ ok: true, data: results_insert });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false });
  }
});

app.post('/add_use_washcar', async (req, res) => {
  console.log("dssadewewewe5")
  try {
    if (req.body.check_send_data == 1) {
      // console.log(req.body.price)
      // const [results_credit] = await db.query(`select * from credit where  status = 1  `);
      const [results_customer] = await db.query(`select * from customer where  username =  ? `, [req.body.email_cus]);
      console.log(results_customer[0].money)
      if (results_customer[0].money <= 0) {
        res.send({ ok: false, txt: "money" });
      } else {
        let txt = "/box" + req.body.car_idname + "/credit_balance"
        const [results_carwash] = await db.query(`select status from car_wash where  car_name =  ? and delete_time IS NULL`, ["box" + req.body.car_idname]);
        console.log(results_carwash[0].status)
        const ref_foam = db_fb.ref("/box" + req.body.car_idname + '/state_foam');
        const ref_water = db_fb.ref("/box" + req.body.car_idname + '/state_water');

        const [foamSnapshot, waterSnapshot] = await Promise.all([
          ref_foam.once('value'),
          ref_water.once('value')
        ]);
        const data_ref_foam = foamSnapshot.val() || 0;
        const data_ref_water = waterSnapshot.val() || 0;

        console.log("Foam:", data_ref_foam);
        console.log("Water:", data_ref_water);
        if (results_carwash[0].status == 0 || data_ref_foam == 0 || data_ref_water == 0) {
          res.send({ ok: false, txt: "box" });
          console.log("dsd")
        } else {

          // ลองตรงนี้
          const [results_up] = await db.query(`UPDATE car_wash SET status = 2   where  car_name = ? and delete_time IS NULL`,
            ["box" +req.body.car_idname]);
          console.log(results_up)
          console.log("/box" +req.body.car_idname)
          // 
          db_fb.ref(txt).set(parseFloat(results_customer[0].money) + parseFloat(req.body.credit_free)).then(() => {
            db_fb.ref("/box" + req.body.car_idname + "/new_state").set(1).then(() => {
              db_fb.ref("/box" + req.body.car_idname + "/working_now").set(0).then(() => {
                res.send({ ok: true, data: results_customer });
              }).catch((error) => {
                res.send({ ok: false, txt: "box" });
              });
            }).catch((error) => {
              res.send({ ok: false, txt: "box" });
            });
          }).catch((error) => {
            res.send({ ok: false, txt: "box" });
          });
        }

      }

    }
  } catch (error) {
    console.error(error);
    res.status(200).send({ ok: false });
  }



});



app.post('/choise_time_return_data_promotion', async (req, res) => {

  try {
    const [results_id_branch] = await db.query(`
    SELECT branch_id FROM car_wash  WHERE car_name = ? `,
      "box" + req.body.id_branch);
    console.log(results_id_branch[0].branch_id)
    const [results_promotion] = await db.query(`
    SELECT promotion.*,type_promotion.name FROM promotion 
    JOIN type_promotion ON promotion.type = type_promotion.id_type 
    WHERE branch_id in (SELECT b_id
      FROM (
        SELECT promotion.id_promo, amount - COUNT(*) as total,promotion.branch_id as b_id
        FROM use_car_wash
        JOIN promotion ON use_car_wash.id_promo = promotion.id_promo
        GROUP BY promotion.id_promo
        HAVING total > 0 and b_id in(0,?)
      ) AS subquery
      )    ORDER BY price DESC LIMIT 3  `,
      results_id_branch[0].branch_id);
    console.log(results_promotion)
    // const [results] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`,
    //   [req.body.username]);
    res.send({ ok: true, data: results_promotion });
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false });
  }



});








// ALTER TABLE Persons
// ALTER City SET DEFAULT 'Sandnes';




app.post('/dddd', async (req, res) => {

  try {

    const [results_alter] = await db.query(`
      ALTER TABLE use_car_wash
      ALTER credit SET DEFAULT '1' `,
      req.body);

    // const [results] = await db.query(`select * from customer where  username = ?  and delete_time IS NULL`,
    //   [req.body.username]);
    res.send({ ok: true, data: results_alter });


  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false, data: results });
  }



});


app.post('/send_use_carwash', async (req, res) => {
  console.log(req.body.status_check);
  try {
    if (req.body.status_check == 1) {
      const [results_point] = await db.query(`
      SELECT credit_point FROM credit `,
      );
      console.log(results_point[0].credit_point)
      const [results_insert] = await db.query(`INSERT INTO use_car_wash(price,id_promo,email_cus,idcar_wash,id_credit) VALUES (?,?,?,?,?) `,
        [parseFloat(req.body.price) / parseInt(results_point[0].credit_point), req.body.promotion, req.body.email_cus, req.body.id_car, 1]);
      // console.log(results_insert);
      const [results_up] = await db.query(`UPDATE customer SET money = ?   where  username = ? and delete_time IS NULL`,
        [req.body.balance, req.body.email_cus]);

      const [results_up_car] = await db.query(`UPDATE car_wash SET status = 1   where  car_name = ? and delete_time IS NULL`,
        ["box" +req.body.id_car]);



      let txt = "/box" + req.body.id_car + "/credit_balance"
      db_fb.ref(txt).set(0).then(() => {
        db_fb.ref("/box" + req.body.id_car + "/working_now").set(0).then(() => {
          db_fb.ref("/box" + req.body.id_car + "/working_state").set(0).then(() => {
            db_fb.ref("/box" + req.body.id_car + "/working_new").set(0).then(() => {
              db_fb.ref(txt).set(0).then(() => {
                res.send({ ok: true });
              }).catch((error) => {
                console.error('Error:', error);
              });
            }).catch((error) => {
              console.error('Error:', error);
            });
          }).catch((error) => {
            console.error('Error:', error);
          });
        }).catch((error) => {
          console.error('Error:', error);
        });
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false });
  }
});

app.post('/end_use_carwash', async (req, res) => {
  try {
    if (req.body.status_check == 1) {
      if (req.body.promotion != 0) {
        const [results_insert] = await db.query(`INSERT INTO use_car_wash(price,id_promo,email_cus,idcar_wash,id_credit) VALUES (?,?,?,?,?) `,
          [0, req.body.promotion, req.body.email_cus, req.body.id_car, 1]);
      }
      console.log("dsadasddas")

      const [results_up_car] = await db.query(`UPDATE car_wash SET status = 1   where  car_name = ? and delete_time IS NULL`,
        ["box" +req.body.id_car]);

      let txt = "/box" + req.body.id_car + "/credit_balance"
      db_fb.ref(txt).set(0).then(() => {
        db_fb.ref("/box" + req.body.id_car + "/working_now").set(0).then(() => {
          db_fb.ref("/box" + req.body.id_car + "/working_state").set(0).then(() => {
            db_fb.ref("/box" + req.body.id_car + "/working_new").set(0).then(() => {
              db_fb.ref("/box" + req.body.id_car + "/credit_balance").set(0).then(() => {
                res.send({ ok: true });
              }).catch((error) => {
                console.error('Error:', error);
              });
            }).catch((error) => {
              console.error('Error:', error);
            });
          }).catch((error) => {
            console.error('Error:', error);
          });
        }).catch((error) => {
          console.error('Error:', error);
        });
      }).catch((error) => {
        console.error('Error:', error);
      });
    } else if (req.body.status_check == 2) {
      console.log("สิิก")
      let txt = "/box" + req.body.id_car + "/credit_balance"
      db_fb.ref(txt).set(0).then(() => {
        db_fb.ref(txt).set(0).then(() => {
          res.send({ ok: true });
        }).catch((error) => {
          console.error('Error:', error);
        });
      }).catch((error) => {
        console.error('Error:', error);
      });

    }

    // เซ็ตเป้น 0 ห้ได้
    // else {

    //   db_fb.ref("/box" + req.body.id_car + "/credit_balance").set(0).then(() => {
    //     res.send({ ok: true });
    //   }).catch((error) => {
    //     console.error('Error:', error);
    //   });
    // }
  } catch (error) {
    console.error(error);
    res.status(500).send({ ok: false });
  }
});






// app.post('/mosmqtt_oil', (req, res) => {
//   client.publish('mosmqtt_oil', req.body.mqtt);
//   res.status(200).json({ 'success': true, 'message': 'insert data successs' });

// })

// app.post('/mosmqtt_oil_att', (req, res) => {
//   client.publish('mosmqtt_oil', req.body.mqtt);
//   res.status(200).json({ 'success': true, 'message': 'insert data successs' });

// })

app.listen(3000, () => {
  console.log('Server listening on port 4000');
});