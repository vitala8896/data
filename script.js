const inp1 = document.getElementById('inp1');
const inp2 = document.getElementById('inp2');
const res = document.getElementById('res');
let uni;
let index;
inp1.addEventListener('click', uni1);
function uni1() {
  uni = 'OI';
  inp1.checked = true;
  inp2.checked = false;
  newA = {};
  index = 1;
  res.innerHTML = '';
  getAllUsersByUni(uni)
}
inp2.addEventListener('click', () => {
  uni = 'STG';
  inp2.checked = true;
  inp1.checked = false;
  newA = {};
  index = 0;
  res.innerHTML = '';
  getAllUsersByUni(uni)
});
const DB = [
  {
    p_key: 'CONFIG',
    s_key: 'main',
    data: {
      unis: [
        {
          uni: 'STG',
          urlPrefix: 'https://stg.com',
          studentUrl: 'https://{STUDENT_NUMBER}.stg.com',
          adminLink: 'https://admin-{ADMIN_NUMBER}.stg.com'
        },
        {
          uni: 'OI',
          urlPrefix: 'https://oi.com',
          studentUrl: 'https://{STUDENT_NUMBER}.oi.com',
          adminLink: 'https://admin-{ADMIN_NUMBER}.oi.com'
        }
      ]
    }
  },

  { p_key: 'STG#CONFIG', university_name: 'Staging' },
  { p_key: 'OI#CONFIG', university_name: 'Oxford international' },

  { p_key: 'STG#1000', s_key: 'STUDENT_DETAILS', data: { name: 'name - 1' } },
  { p_key: 'OI#2000', s_key: 'STUDENT_DETAILS', data: { name: 'name - 2' } },
  { p_key: 'STG#4000', s_key: 'STUDENT_DETAILS', data: { name: 'name - 4' } },
  { p_key: 'STG#5000', s_key: 'STUDENT_DETAILS', data: { name: 'name - 5' } },

  { p_key: 'STG#1000', s_key: 'FINANCE', data: { deposit: 200 } },
  { p_key: 'OI#2000', s_key: 'FINANCE', data: { deposit: 400 } },
  { p_key: 'STG#4000', s_key: 'FINANCE', data: { deposit: 700 } },
  { p_key: 'STG#5000', s_key: 'FINANCE', data: { deposit: 100 } },

  { p_key: 'OI#MANAGER', s_key: 'main', hasAccess: ['2000'] },
  { p_key: 'STG#MANAGER', s_key: 'main', hasAccess: ['4000'] },

  { p_key: 'STG#1000', s_key: 'USER#STUDENT' },
  { p_key: 'OI#2000', s_key: 'USER#STUDENT' },
  { p_key: 'ADM#STG#3000', s_key: 'USER#ADMIN' },
  { p_key: 'STG#4000', s_key: 'USER#STUDENT' },
  { p_key: 'STG#5000', s_key: 'USER#STUDENT' },
  { p_key: 'ADM#OI#6000', s_key: 'USER#ADMIN' }
];

const getAllUsersByUni = (uni) => {
  var newA = {};
  res.innerHTML = '';
  DB.forEach(item => {
    if (item.p_key === uni + '#CONFIG') newA.uni = item.university_name;
    if (item.p_key === 'CONFIG') {
      item.data.unis.forEach((universitets) => {
        if (universitets.uni === uni) { newA.shortCode = universitets.uni }
        if (universitets.uni === uni) { newA.uniUrl = item.data.unis[index].urlPrefix }
      });
    }
    if (item.s_key === 'USER#STUDENT') {
      newA.students == undefined ? newA.students = [] : '';
      studentNumber = item.p_key.slice(index == 0 ? 4 : 3, index == 0 ? 8 : 7);
      item.p_key.slice(0, 1) == (index == 0 ? 'S' : 'O') ? newA.students.push({ studentNumber, uni }) : "";
    }
    if (item.s_key === 'USER#ADMIN') {
      (item.p_key.slice(4, 5) == (index == 0 ? 'S' : 'O')) ? (newA.admins = { shortCode: item.p_key.slice(0, 3), list: [] }) : "";
    }
  });
  DB.forEach(item => {
    if (item.s_key == 'STUDENT_DETAILS') {
      newA.students.forEach(student => {
        if (item.p_key == (student.uni + "#" + student.studentNumber)) { student.name = item.data.name };
      });
    }
    if (item.s_key == 'FINANCE') {
      newA.students.forEach((student) => {
        if (item.p_key == (student.uni + "#" + student.studentNumber)) { student.deposit = item.data.deposit };
      });
    }
    if (item.p_key === 'CONFIG') {
      item.data.unis.forEach(universitets => {
        newA.students.forEach(student => {
          if (universitets.uni == student.uni) { student.studentUrl = universitets.studentUrl.replace('{STUDENT_NUMBER}', student.studentNumber) };
        });
      });
    }
    if (item.s_key === 'USER#ADMIN') {
      (item.p_key.slice(4, 5) == (index == 0 ? 'S' : 'O')) ? (newA.admins.list.push({ id: item.p_key.slice(-4) })) : "";
    }
    DB.forEach(item => {
      if (item.p_key === 'CONFIG') {
        item.data.unis.forEach(universitets => {
          newA.admins.list.forEach(admin => {
            if (universitets.uni == uni) { admin.link = universitets.adminLink.replace('{ADMIN_NUMBER}', admin.id) };
            admin.students == undefined ? admin.students = [] : '';
          });
        });
      };
      if (item.s_key === 'main' && item.hasAccess) {
        newA.admins.list.forEach(admin => {
          admin.students[0] == undefined ? admin.students = [{}] : '';
          admin.students.forEach(student => {
            (item.p_key.slice(0, 1) == (index == 0 ? 'S' : 'O')) ? (student.studentNumber = item.hasAccess[0]) : ""
          });
        });
        };
        if (item.p_key === 'CONFIG') {
          item.data.unis.forEach(universitets => {
            newA.admins.list.forEach(admin => {
              admin.students.forEach(student => {
                if (universitets.uni == uni) {student.studentUrl = universitets.studentUrl.replace('{STUDENT_NUMBER}', student.studentNumber)};
              });
            });
          });
        };
      });
  });
  res.innerHTML = JSON.stringify(newA);
  console.log(newA);
};
const stgUsers = getAllUsersByUni(uni);