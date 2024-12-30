import React, { useState, useRef, useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button';
import * as XLSX from 'xlsx';
import * as service from './uploadService.js'

export default function UploadFile(selectedFile) {

  const fileInputRef = useRef(null);
  const [excelFile, setExcelFile] = useState(null);
  const [apiCall, setApiCall] = useState(false);
  const [edit, setEdit] = useState(false);

  //submit state
  const [excelData, setExcelData] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editableData, setEditableData] = useState([]);

  const openExcelFile = async () => {
    if (selectedFile && selectedFile.selectedFile) {
      try {
        const file = await service.fetchDataById(selectedFile.selectedFile);
        
        // Check if file.data exists and has at least one item
        if (file) {
          const data = JSON.parse(file[0].file)
          setExcelData(data);
          setEditableData(data);
          setFileName(file[0].filename);
          setCurrentId(file[0].file_id);
          setApiCall(true);
        } else {
          console.error("Data structure is incorrect:", file);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }
  
  useEffect(() => {
    openExcelFile();
  }, []);
  

  const enableEditing = () => {
    if(localStorage.getItem("user")){
      setEdit(!edit)
    }else{
      console.log('Please log in')
    }
  }
  const saveFile = () => {
    setEdit(!edit);
  }
  
  const handleChange  = (event) => {
    let selectedFile = event.target.files[0]
    if(!selectedFile){
      console.log("No file selected")
      setExcelFile(null);
    } else{
      console.log("file selected "+ selectedFile.name)
      setFileName(selectedFile.name)
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        setExcelFile(e.target.result);
      }
    }
  }

  const handleEdit = (rowIndex, colName, newValue) => {
    const updatedData = [...editableData];
    updatedData[rowIndex][colName] = newValue;
    setEditableData(updatedData);
  };

  const uploadNewData = async (event) => {
    const data = {
      id: currentId,
      editableData: editableData
    }
    console.log("new data:", data)
    await service.updateData(data);
    // await service.fetchDataById(currentId);
  }

  const handleUpload = async (event) => {
    event.preventDefault();
    if(excelFile !== null){
      const workbook = XLSX.read(excelFile, {type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
      setEditableData(data);
      
      const userData = localStorage.getItem("user");
      if(userData){
        const user = JSON.parse(userData);               //parse json string into object
        const userId = user.user_id;
        const fileData = {
          userId: userId,
          data: data,
          fileName: fileName
        }
        const id = await service.insertData(fileData);
        await service.fetchData();
        setCurrentId(id);
        // await service.fetchDataById(id);
      }
    }
  }

  const downloadExcel = () => {
    service.downloadData(currentId, fileName)
    console.log("downloading!!!")
  }

  const cancelUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setExcelFile(null)
    }
  }
  

  return (
    <>
    <div className="viewer">
      {excelData? (
        <>
          <div className='mb-2 mt-2' style={{color: 'white'}}>
          <div className="bg-secondary text-left pt-3 pb-3 pl-4 pr-4">
              { apiCall? "File Opened" : "File Uploaded successfully!!!"}
            <div style={{float: 'right', marginTop: '-7px'}}>
              {
                edit ? 
                <>
                <Button onClick={downloadExcel} className='mr-3' variant="primary">Download</Button>
                <Button onClick={uploadNewData} className='mr-3' variant="primary">Upload</Button>
                <Button onClick={saveFile} variant="success">Save</Button>
                </>
                :
                <Button onClick={enableEditing} variant="success">Edit</Button>
              }
            </div>
          </div>
        </div>
        <div className="table-responsive" style={{color: 'white'}}>
          <table className="table">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((colName) => (
                  <th key={colName}>
                    {
                      edit? 
                      <input type="text" value={colName}  onChange={(e) => handleEdit(0, colName, e.target.value)}/>:
                      colName
                    }
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, rowIndex)=>(
                <tr key={rowIndex}>
                  {Object.keys(row).map((colName)=>(
                    <td key={colName}>
                      {
                        edit? 
                        <input type="text" value={row[colName]} onChange={(e) => handleEdit(rowIndex, colName, e.target.value)}/>:
                        row[colName]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      ):(
        <>
          <div className="d-flex justify-content-center mt-4">
          <div className='border rounded-4 p-4' style={{height: "16rem"}}>
              <div className='align-middle font-weight-bold mt-4' style={{color: "white"}}>Upload .csv file below</div>
              <label className="form-label" htmlFor="customFile">Default file input example</label>
              <input onChange={handleChange} type="file" accept=".csv" ref={fileInputRef} className="form-control" id="customFile" />
              <div className='mt-4 d-flex justify-content-center'>
                  <Button onClick={cancelUpload} className='w-25 mr-2' variant="danger">Cancel</Button>
                  <Button onClick={handleUpload} className='w-25 ml-2' variant="primary">Upload</Button>
              </div>
          </div>
          </div>
          <div className='d-flex justify-content-center mt-2' style={{color: 'white'}}>
                <div className="border-0 rounded-4 bg-secondary pt-2 pb-2 pl-4 pr-4">
                    No file is uploaded yet
                </div>
          </div>
        </>
      )}
    </div>

    </>
  )
}
