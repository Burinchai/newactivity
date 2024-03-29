import { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Link } from "react-router-dom";

const StudentForm = () => {
  
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [zipcode, setZipcode] = useState();
  const [selected, setSelected] = useState({
    province_id: undefined,
    amphure_id: undefined,
    tambon_id: undefined,
    zip_code: undefined
  });


  const onChangeHandle = (id, selectedValue) => {
    if (id === "province_id") {
      setProvinceValue(selectedValue);
    } else if (id === "amphure_id") {
      setDistrictValue(selectedValue);
    } else if (id === "tambon_id") {
      setSubdistrictValue(selectedValue);
    }
  };

  const DropdownList = ({
    id,
    list,
    child,
    childsId = [],
    setChilds = [],
    addressValue_PDS
  }) => {
    const onChangeHandleLocal = (event) => {
      setChilds.forEach((setChild) => setChild([]));
      const entries = childsId.map((child) => [child, undefined]);
      const unSelectChilds = Object.fromEntries(entries);
  
      const input = event.target.value;
      const dependId = input ? Number(input) : undefined;
      setSelected((prev) => ({ ...prev, ...unSelectChilds, [id]: dependId }));
  
      if (!input) return;
  
      if (child) {
        const parent = list.find((item) => item.id === dependId);
        if (parent) {
          const { [child]: childs } = parent;
          const [setChild] = setChilds;
          setChild(childs);
        }
      }
  
      const selectedValue = list.find((item) => item.id === dependId)?.name_th || '';
      onChangeHandle(id, selectedValue);
    };
  
    return (
      <>
        <select value={selected[id]} onChange={onChangeHandleLocal} className="mt-1 p-2 border w-full rounded-md">
          <option key={selected[id]} value={selected[id]} label={addressValue_PDS} />
  
          {list && list.map((item) => (
              <option
                key={item.id}
                value={item.id}
                label={item.name_th}
              >
                {item.name_th}
              </option>
            ))}
        </select>
      </>
    );
  };
  
  const [username, setUsername] = useState('');
  const [fnameValue, setFnameValue] = useState();
  const [lnameValue, setLnameValue] = useState('');
  const [staffIDValue, setstaffID] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [provinceValue, setProvinceValue] = useState('');
  const [districtsValue, setDistrictValue] = useState('');
  const [subdistrictsValue, setSubdistrictValue] = useState('');
  const [zipcodeValue, setZipcodeValue] = useState('');

  const loginID = localStorage.getItem('login_ID');

  useEffect(() => {
    // กำหนด URL ของ API ที่สร้างด้วย Node.js
    const apiUrl = 'http://localhost:3333/api/staff?id=';

    fetch(apiUrl + loginID)
      .then(response => {
        if (!response.ok) {
          throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
        return response.json();
      })
      .then(data => {
        console.log(data)
        setUsername(data.login_ID)
        setstaffID(data.staff_ID)
        setFnameValue(data.staff_fname);
        setLnameValue(data.staff_lname);
        setMobileValue(data.staff_mobile);
        setEmailValue(data.staff_email);
        setAddressValue(data.staff_address);
        setSubdistrictValue(data.subdistrict);
        setDistrictValue(data.district);
        setProvinceValue(data.province);
        setZipcodeValue(data.zipcode);
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาด: ', error);
      });


      fetch(
        "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
      )
        .then((response) => response.json())
        .then((result) => {
          // Sort the provinces alphabetically by name_th
          const sortedProvinces = result.sort((a, b) =>
            a.name_th.localeCompare(b.name_th)

          );

          const idProvince = sortedProvinces.map(province => [province.id, province.name_th]);

          console.log(idProvince);


          

          console.log(sortedProvinces);
          setProvinces(sortedProvinces);
        });


        console.log(loginID)


      

  }, [loginID]);



  const updateFname = (event) => {
    setFnameValue(event.target.value);
  }
  const updateLname = (event) => {
    setLnameValue(event.target.value);
  }
  const updateMobile = (event) => {
    setMobileValue(event.target.value);
  }
  const updateEmail = (event) => {
    setEmailValue(event.target.value);
  }
  const updateAddress = (event) => {
    setAddressValue(event.target.value);
  }

  const updateZipcode = (event) => {
    const value = event.target.value;
    setZipcodeValue(value);
  };



  const updateClick = (event) => {
    event.preventDefault();
  
    const dataJson = {
      fname: fnameValue,
      lname: lnameValue,
      mobile: mobileValue,
      email: emailValue,
      address: addressValue,
      province: provinceValue,
      district: districtsValue,
      subdistrict: subdistrictsValue,
      zipcode: zipcode,
    };
  
    fetch('http://localhost:3333/api/updateStaff/' + staffIDValue, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataJson),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
   })
   .then(result => {
      console.log(result);
      Swal.fire({
        title: 'แก้ไขประวัติส่วนตัวเสร็จสิ้น',
        icon: 'success',
      });
      setTimeout(() => {
        window.location = '/teacher/calendar';
      }, 1500);
   })
   .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: 'Oops...something went wrong!',
        icon: 'error',
        text: `Error occurred! ${error.message}`,
        confirmButtonText: 'OK',
      });
   });
   
  };
  

  if (!username) {
    return <div>Loading...</div>;
  }
  return (

    <div className="w-full lg:w-2/3 mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <Link to='/activity/dashboard'>
        <div className="items-center mb-5"><ArrowBackIosNewIcon />ย้อนกลับ</div>
      </Link>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:px-10">

        <div className="mb-4">
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-600">
            รหัสประจำตัวอาจารย์
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={staffIDValue}
            readOnly
            className="mt-1 p-2 border w-full rounded-md" />
        </div>


        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
            ชื่อ
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            onChange={updateFname}
            value={fnameValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
            นามสกุล
          </label>
          <input
            type="text"
            id="lname"
            name="lname"
            onChange={updateLname}
            value={lnameValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
            เบอร์โทร
          </label>
          <input
            type="tel"
            id="tel"
            name="tel"
            onChange={updateMobile}
            value={mobileValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            อีเมลล์
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={updateEmail}
            value={emailValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            ที่อยู่
          </label>
          <input
            id="address"
            name="address"
            onChange={updateAddress}
            value={addressValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>

        <div className="mb-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-600">
            จังหวัด
          </label>
          <DropdownList
            id="province_id"
            list={provinces}
            child="amphure"
            childsId={["amphure_id", "tambon_id"]}
            addressValue_PDS={provinceValue}
            setChilds={[setAmphures, setTambons]}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="district" className="block text-sm font-medium text-gray-600">
            อำเภอ
          </label>
          <DropdownList
            id="amphure_id"
            list={amphures}
            child="tambon"
            childsId={["tambon_id"]}
            setChilds={[setTambons]}
            addressValue_PDS={districtsValue}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="province" className="block text-sm font-medium text-gray-600">
            ตำบล
          </label>
          <DropdownList
            id="tambon_id"
            list={tambons}
            child="zip_code"
            childsId={["zip_code"]}
            setChilds={[setZipcode]}
            addressValue_PDS={subdistrictsValue}
          />
        </div>


        <div className="mb-4">
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-600">
            รหัสไปรษณีย์
          </label>
          <input
            type="text"
            id="zipcode"
            name="zipcode"
            onChange={updateZipcode}
            value={zipcode ?? zipcodeValue}
            className="mt-1 p-2 border w-full rounded-md" />
        </div>
        
      </form>
        <div className="flex justify-center items-center mb-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-1/8 " onClick={updateClick}>
            แก้ไข
          </button>
        </div>
    </div>

  );
};

export default StudentForm;
