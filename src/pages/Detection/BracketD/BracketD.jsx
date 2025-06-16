import { Alert, AlertTitle, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import colors from '../../../utils/colors';
import { Cropper } from 'react-advanced-cropper';
import axios from 'axios';
import BracketDReport from './BracketDReport';
import 'react-advanced-cropper/dist/style.css';
import { useSelector } from 'react-redux';
import { TbAlertTriangleFilled } from "react-icons/tb";
import { IoFileTray } from "react-icons/io5";
import { LuArrowLeftRight } from "react-icons/lu";

const BACKEND_API = import.meta.env.VITE_BACKEND_API;


const BracketD = () => {
  const { token } = useSelector((state) => state.auth);
  const imageInputRef = useRef(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
const [uploadedFileURL, setUploadedFileURL] = useState(null);
console.log(uploadedFileURL)
const [fileType, setFileType] = useState(null); // 'image' or 'video'
const [uploadError, setUploadError] = useState(null);
const [isCapturingSnapshot, setIsCapturingSnapshot] = useState(false);
const [capturedImage, setCapturedImage] = useState(null);
const [showCropModal, setShowCropModal] = useState(false);
const cropperRef = useRef(null);
const [detectionAlert, setDetectionAlert] = useState(false);
const [submitModalOpen, setSubmitModalOpen] = useState(false);
const [zoom, setZoom] = useState(1);
const [addedItem, setAddedItem] = useState(null);
console.log(addedItem)
const [totalCrates, setTotalCrates] = useState(0);
const [isImgIncorrect, setIsImgIncorrect] = useState(false);
const [selectedSide, setSelectedSide] = useState(''); // Default to 'LH'
const [isLoading, setIsLoading] = useState(false);


// Handle file upload
const handleFileUpload = (event, type) => {
  setIsImgIncorrect(false);
  setUploadError(null);
  const file = event.target.files[0];
  console.log(file)
  
  if (!file) return;
  
  // Validate file type
  if (type === 'image' && !file.type.startsWith('image/')) {
    setUploadError('Please upload a valid image file.');
    return;
  }
  
  // if (type === 'video' && !file.type.startsWith('video/')) {
  //   setUploadError('Please upload a valid video file.');
  //   return;
  // }
  
  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    setUploadError('File size cannot exceed 10MB.');
    return;
  }
  
  setIsFileLoading(true);
  
  // Revoke previous object URL if exists
  if (uploadedFileURL) {
    URL.revokeObjectURL(uploadedFileURL);
  }
  
  const fileURL = URL.createObjectURL(file);
  setUploadedFile(file);
  setUploadedFileURL(fileURL);
  setFileType(type);
  
  // Reset video frame if switching from video to image
  // if (type === 'image') {
  //   setCurrentVideoFrame(null);
  // }
  
  setIsFileLoading(false);
};

const captureImageForCropping = async() => {
  const formData = new FormData();
formData.append("file", uploadedFile); // Must match backend's field name: 'file'

  // try {
  //   const response = await axios.post("http://192.168.1.152:8015/upload-classification", formData, {
  //     headers: {
  //       Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2ciLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NDkyODc5Nzl9.Nfu9CA340hOPtDOKFhXyJSHy5yL8_u3Os8gZ68Qf9qA"
  //       // Don't set Content-Type manually
  //     }
  //   });
  //   console.log(response.data);
  // } catch (error) {
  //   console.error("Error uploading file:", error);
  // }
  // console.log(file)
  if (fileType === 'image' && uploadedFile) {
    setIsCapturingSnapshot(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageBase64 = e.target.result.split(',')[1]; // Remove the data URL prefix
      console.log(imageBase64)
      setCapturedImage(imageBase64); 
      setShowCropModal(true);
      setIsCapturingSnapshot(false);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setUploadError('Error processing image. Please try again.');
      setIsCapturingSnapshot(false);
    };
    reader.readAsDataURL(uploadedFile);
  }
};

// useEffect(() => {
//   async function fetchData() {
//     try {
//       const response = await axios.get(`http://192.168.1.152:8015/images-data-classificaton`, {
//         headers: {
//           Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2ciLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NDkyODc5Nzl9.Nfu9CA340hOPtDOKFhXyJSHy5yL8_u3Os8gZ68Qf9qA`
//         }
//       });

//       console.log(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   }

//   fetchData();
// }, []);
// Function to create a cropped image from the original
const createCroppedImage = async () => {
  if (!capturedImage || !cropperRef.current) return null;
  
  try {
    // Get the cropped canvas from the cropper
    const canvas = cropperRef.current.getCanvas();
    if (!canvas) {
      console.error('Failed to get canvas from cropper');
      return null;
    }
    
    // Convert canvas to base64
    const croppedImageBase64 = canvas.toDataURL('image/jpeg')
      .replace('data:image/jpeg;base64,', '');
    
    return croppedImageBase64;
  } catch (error) {
    console.error('Error creating cropped image:', error);
    return null;
  }
};
function base64ToFile(base64String, filename) {
  const arr = base64String.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
// Modified detect circles function to use cropped image
// const detectCirclesWithCroppedImage = async () => {
//   console.log(capturedImage)
//   try {
//     const croppedImageBase64 = await createCroppedImage();
//     const base64 = `data:image/jpeg;base64,${croppedImageBase64}`;
//     const cropedImageFile = base64ToFile(base64, `captured_${Date.now()}.jpg`);;
//     console.log(cropedImageFile)
//     console.log(croppedImageBase64)
//     if (!croppedImageBase64) {
//       alert('Failed to process cropped image');
//       return;
//     }

//     const response = await axios.post("http://192.168.1.152:8015/upload-classification", formData, {
//           headers: {
//             Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2ciLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NDkyODc5Nzl9.Nfu9CA340hOPtDOKFhXyJSHy5yL8_u3Os8gZ68Qf9qA"
//             // Don't set Content-Type manually
//           }
//         });
//         console.log(response.data);

//      // try {
//   //   const response = await axios.post("http://192.168.1.152:8015/upload-classification", formData, {
//   //     headers: {
//   //       Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2ciLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NDkyODc5Nzl9.Nfu9CA340hOPtDOKFhXyJSHy5yL8_u3Os8gZ68Qf9qA"
//   //       // Don't set Content-Type manually
//   //     }
//   //   });
//   //   console.log(response.data);
//   // } catch (error) {
//   //   console.error("Error uploading file:", error);
//   // }
    
//     // Hide crop modal and show detection alert
//     setShowCropModal(false);
//     setDetectionAlert(true);
    
//     // const token = localStorage.getItem("isLoggedIn");
//     if (!token) {
//       alert("Please log in to continue.");
//       return;
//     }
    
//     // const requestData = {
//     //   base64_image: croppedImageBase64,
//     // };
    
//     // const response = await axios.post(
//     //   // "http://13.202.42.73:8012/telescopicPVCPipes",
//     //   `${BACKEND_URL}/telescopicPVCPipes`,
//     //   requestData,
//     //   {
//     //     headers: {
//     //       accept: "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   }
//     // );
    
//     // Process response and store object_count_id and bounding boxes
//     // if (response.data?.object_count) {
//     //   const objectCount = response.data.object_count.object_count;
//     //   const processedImageUrl = response.data.object_count.original_image_url;
//     //   const objectCountId = response.data.object_count._id;
      
//     //   // Store the bounding box data if available
//     //   const boundingBoxes = response.data.bbox_list || [];
      
//     //   if (objectCount > 0) {
//     //     setCount(objectCount);
//     //     setProcessImage(processedImageUrl);
//     //     // Store objectCountId in state to pass to TruckDetails
//     //     setObjectCountId(objectCountId);
        
//     //     // Open modal and pass the bounding boxes
//     //     setOpenModal(true);
        
//     //     // Pass boundingBoxes to TruckDetails component via state or props
//     //     setBoundingBoxList(boundingBoxes); // Add this state variable
//     //   } else {
//     //     alert("No pipes detected in the image.");
        
//     //   }
//     // } else {
//     //   console.error("Unexpected response structure:", response.data);
//     //   alert("Error processing the image. Please try again.");
//     // }
//   } catch (error) {
//     console.error("Error in pipe detection:", error);
//     alert(error.response?.data?.message || "Failed to detect pipes. Please try again.");
//   } finally {
//     setDetectionAlert(false);
//   }
// };

const detectCirclesWithCroppedImage = async () => {
  try {
    if(selectedSide === ''){
      alert('Please select a side (LH or RH) before proceeding.');
      return;
    }
    console.log("Captured Image:", capturedImage);

    // Step 1: Create cropped base64 image
    const croppedImageBase64 = await createCroppedImage();

    if (!croppedImageBase64) {
      alert('Failed to process cropped image');
      return;
    }

    // Step 2: Convert base64 to File
    const base64Data = `data:image/jpeg;base64,${croppedImageBase64}`;
    const croppedImageFile = base64ToFile(base64Data, `captured_${Date.now()}.jpg`);
    console.log("File to upload:", croppedImageFile);

    // Step 3: Prepare FormData and append file
    // const formData = new FormData();
    // formData.append('file', croppedImageFile); // Adjust key if your backend expects something else
// Step 3: Prepare FormData and append file + expected_type
// const expectedType = "LH"; // or dynamically set based on user choice or application logic
const formData = new FormData();
formData.append('file', croppedImageFile);  
// formData.append('expected_type', expectedType);
    // Step 4: Upload to server
    setIsLoading(true);
    const response = await axios.post(
      `${BACKEND_API}/upload-classification?expected_type=${selectedSide}`, // Use selected side from state
      formData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`, // Use token from Redux state
          // Axios will automatically set 'Content-Type' for FormData
        },
      }
    );
    setIsLoading(false);
    setAddedItem(response.data);
    console.log("Upload response:", response.data);
    if(response.data.incorrect_brackets>0){
      setIsImgIncorrect(true);
    }else{
      setSubmitModalOpen(true);   
      setUploadedFileURL(null);
      setUploadedFile(null);
      setSelectedSide('');
    }

    // Step 5: Post-upload actions
    setShowCropModal(false);
    setDetectionAlert(true);

    
    

    if (!token) {
      alert("Please log in to continue.");
      return;
    }

    // Further detection logic can go here...
    // e.g. Send base64 to another endpoint, process bounding boxes, etc.

  } catch (error) {
    console.error("Error in Bracket detection:", error);
    alert(error.response?.data?.message || "Failed to detect Brackets. Please try again.");
    setIsLoading(false);
  } finally {
    setDetectionAlert(false);
  }
};



// Reset cropper to initial state
const resetCropper = () => {
  if (cropperRef.current) {
    cropperRef.current.reset();
  }
  setZoom(1);
};


  const FileUploadComponent = () => {
   
    if (isFileLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (!uploadedFile && !uploadedFileURL) {
      return (
        // className="file-upload-container d-flex flex-column justify-content-center align-items-center h-100"
        <div style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',height: '100%',  padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
          {/* className="upload-options d-flex flex-column align-items-center" */}
          <div style={{margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <Typography variant="h6" className="mb-4">
            Click here to Upload Image
            </Typography>
            
            <div className="d-flex justify-content-center mb-3">
              <Button 
                variant="contained" 
                // startIcon={<UploadIcon />}
                sx={{ 
                  m: 1, 
                  // backgroundColor: '#4B8B3B',
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.buttonHover
                    // backgroundColor: '#3A6F2F'
                  }
                }}
              >
                
                <label htmlFor="image-upload" style={{ cursor: 'pointer', margin: 0, width: '100%', height: '100%' }}>
                 Upload Image
                </label>
                <input
                  id="image-upload"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ width: '10rem', display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
              </Button>

  
              {/* <Button 
                variant="contained"
                startIcon={<VideoLibraryIcon />}
                sx={{ 
                  m: 1,
                  backgroundColor: '#2196F3',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                <label htmlFor="video-upload" style={{ cursor: 'pointer', margin: 0, width: '100%', height: '100%' }}>
                  Upload Video
                </label>
                <input
                  id="video-upload"
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
              </Button> */}
            </div>
            
            {uploadError && (
              <Alert variant="danger" className="mt-3">
                {uploadError}
              </Alert>
            )}
            
            <Typography variant="body2" color="textSecondary" className="mt-3">
              Supported formats: JPEG, PNG • Max 10MB
            </Typography>
          </div>
        </div>
      );
    }


    return (
      // className="uploaded-file-container h-100 d-flex flex-column justify-content-between"
      <div style={{height: '8rem'}} >
        <div className="image-preview flex-grow-1" style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            maxHeight: '350px',
            overflow: 'hidden'
          }}>
            <img 
              src={uploadedFileURL} 
              alt="Uploaded" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '350px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }} 
            />
          </div>
        
        <div className="d-flex justify-content-center py-3" style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', marginLeft: '10rem', marginTop: '1rem' }}>
          <Button 
            variant="outlined"
            onClick={() => {
              setUploadedFile(null);
              setUploadedFileURL(null);
              setFileType(null);
              // setCurrentVideoFrame(null);
              if (uploadedFileURL) {
                URL.revokeObjectURL(uploadedFileURL);
              }
            }}
            sx={{ mx: 1 }}
          >
            Remove
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            // onClick={fileType === 'image' ? captureImageForCropping : captureVideoFrame}
            onClick={captureImageForCropping}
            disabled={isCapturingSnapshot}
            sx={{ mx: 1, bgcolor: colors.primary, '&:hover': {
                                                backgroundColor: colors.buttonHover
                                                // backgroundColor: '#3A6F2F'
                                              } }}
            
          >
            {isCapturingSnapshot ? (
              <>
                <span style={{ opacity: 0 }}>
                  {fileType === 'image' ? 'Process Image' : 'Capture Frame'}
                </span>
                <CircularProgress
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute'
                  }} 
                />
              </>
            ) : (
              fileType === 'image' ? 'Process Image' : 'Capture Frame'
            )}
          </Button>
        </div>
      </div>
    );
  };

  const FileUploadComponent2 = () => {
   
    if (isFileLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (!uploadedFile && !uploadedFileURL) {
      return (
        // className="file-upload-container d-flex flex-column justify-content-center align-items-center h-100"
        <div style={{boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',height: '100%',  padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
          {/* className="upload-options d-flex flex-column align-items-center" */}
          <div style={{margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
            <Typography variant="h6" className="mb-4">
            Click here to Re-Upload Image
            </Typography>
            
            <div className="d-flex justify-content-center mb-3">
              <Button 
                variant="contained" 
                // startIcon={<UploadIcon />}
                sx={{ 
                  m: 1, 
                  // backgroundColor: '#4B8B3B',
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.buttonHover
                    // backgroundColor: '#3A6F2F'
                  }
                }}
              >
                
                <label htmlFor="image-upload" style={{ cursor: 'pointer', margin: 0, width: '100%', height: '100%' }}>
                 Re-Upload Image
                </label>
                <input
                  id="image-upload"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ width: '10rem', display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
              </Button>

  
              {/* <Button 
                variant="contained"
                startIcon={<VideoLibraryIcon />}
                sx={{ 
                  m: 1,
                  backgroundColor: '#2196F3',
                  '&:hover': {
                    backgroundColor: '#1976d2'
                  }
                }}
              >
                <label htmlFor="video-upload" style={{ cursor: 'pointer', margin: 0, width: '100%', height: '100%' }}>
                  Upload Video
                </label>
                <input
                  id="video-upload"
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
              </Button> */}
            </div>
            
            {uploadError && (
              <Alert variant="danger" className="mt-3">
                {uploadError}
              </Alert>
            )}
            
            <Typography variant="body2" color="textSecondary" className="mt-3">
              Supported formats: JPEG, PNG • Max 10MB
            </Typography>
          </div>
        </div>
      );
    }


    return (
      // className="uploaded-file-container h-100 d-flex flex-column justify-content-between"
      <div style={{height: '8rem'}} >
        <div className="image-preview flex-grow-1" style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f8f8',
            maxHeight: '350px',
            overflow: 'hidden'
          }}>
            <img 
              src={uploadedFileURL} 
              alt="Uploaded" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '350px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }} 
            />
          </div>
        
        <div className="d-flex justify-content-center py-3" style={{ backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', marginLeft: '10rem', marginTop: '1rem' }}>
          <Button 
            variant="outlined"
            onClick={() => {
              setUploadedFile(null);
              setUploadedFileURL(null);
              setFileType(null);
              // setCurrentVideoFrame(null);
              if (uploadedFileURL) {
                URL.revokeObjectURL(uploadedFileURL);
              }
            }}
            sx={{ mx: 1 }}
          >
            Remove
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            // onClick={fileType === 'image' ? captureImageForCropping : captureVideoFrame}
            onClick={captureImageForCropping}
            disabled={isCapturingSnapshot}
            sx={{ mx: 1, bgcolor: colors.primary, '&:hover': {
                                                backgroundColor: colors.buttonHover
                                                // backgroundColor: '#3A6F2F'
                                              } }}
            
          >
            {isCapturingSnapshot ? (
              <>
                <span style={{ opacity: 0 }}>
                  {fileType === 'image' ? 'Process Image' : 'Capture Frame'}
                </span>
                <CircularProgress
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute'
                  }} 
                />
              </>
            ) : (
              fileType === 'image' ? 'Process Image' : 'Capture Frame'
            )}
          </Button>
        </div>
      </div>
    );
  };
  
  const deleteReport= async()=>{
    const response = await axios.delete(`${BACKEND_API}/delete-classification/${addedItem.file_id}`, 
      {
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    )

    console.log(response.data)
    setAddedItem({});
    setIsImgIncorrect(false);
    setUploadedFileURL(null);
    setUploadedFile(null);
    setSelectedSide('');

  }

  // function base64ToBlobUrl(base64, mime = 'image/jpeg') {
  //   const byteString = atob(base64);
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([ab], { type: mime });
  //   return URL.createObjectURL(blob);
  // }

  // const blobUrl = base64ToBlobUrl(capturedImage);

  function totalCrateCount(reports) {
    // This function should return the total count of crates
    // For now, returning a static value
    // console.log('reports', reports)
    setTotalCrates(reports.length);
    
  }

  return (
    <>
    <Box>
      <Box sx={{display: 'flex', width: '100%', height: '22rem', justifyContent: 'space-between'}}>
      <Box sx={{width: '54%', bgcolor: 'lightgrey', borderRadius: '17px',  height: '100%',display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
      <Box width={'30%'}  height={'70%'} bgcolor={'#F0FDF4'} boxShadow={'rgba(0, 0, 0, 0.13) 0px 3px 8px;'} borderRadius={'19px'} display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} padding={'1rem'}>
        <Box bgcolor={'#1AAF51'} height={'4rem'} width={'4rem'}  boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'} borderRadius={'17px'} display={'flex'} alignItems={'center'} justifyContent={'center'}><IoFileTray style={{fontSize: '1.8rem', color: 'white'}} /></Box>
        <Typography>Total Crate</Typography>
      <Typography fontSize={'2rem'}>{totalCrates}</Typography>
      </Box>

      <Box width={'30%'}  height={'70%'} bgcolor={'#FFF7ED'} boxShadow={'rgba(0, 0, 0, 0.13) 0px 3px 8px;'}  borderRadius={'19px'}  display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} padding={'1rem'}>
        <Box bgcolor={'#EC5B0D'} height={'4rem'} width={'4rem'}  boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'} borderRadius={'17px'} display={'flex'} alignItems={'center'} justifyContent={'center'}><TbAlertTriangleFilled style={{fontSize: '1.8rem', color: 'white'}} /></Box>
        <Typography>Wrong Crates</Typography>
      <Typography fontSize={'2rem'}>1</Typography>
      </Box>

      <Box width={'30%'}  height={'70%'} bgcolor={'#E5EBF3'} boxShadow={'rgba(0, 0, 0, 0.13) 0px 3px 8px;'}  borderRadius={'19px'}  display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'space-evenly'} padding={'1rem'}>
        <Box bgcolor={'#2A6AEE'} height={'4rem'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'} width={'4rem'} borderRadius={'17px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <LuArrowLeftRight style={{fontSize: '1.8rem', color: 'white'}} /></Box>
        <Typography>Side clasify</Typography>
        <Box display={'flex'} justifyContent={'space-evenly'} width={'100%'}>
        <Box display={'flex'} flexDirection={'column'} width={'49%'} alignItems={'center'} justifyContent={'center'}>
          <Typography>LH</Typography>
        <Typography fontSize={'2rem'}>1</Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} width={'49%'} alignItems={'center'} justifyContent={'center'}>
          <Typography>RH</Typography>
        <Typography fontSize={'2rem'}>1</Typography>
        </Box>
        </Box>
      
      </Box>
      </Box>

      <Box sx={{width: '43%', bgcolor: 'lightgrey'}}>
     <FileUploadComponent />
      </Box>
      </Box>
    </Box>
    <BracketDReport addedItem={addedItem} totalCrateCount={totalCrateCount} />
    {/* ---------show crop modal---------------- */}
    <Dialog
        open={showCropModal}
        onClose={() => setShowCropModal(false)}
        maxWidth={false}
        PaperProps={{
          style: {
            width: '700px',
            maxWidth: '95vw',
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 1.5,
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
            fontWeight: 500,
            fontSize: '1.1rem',
            color: '#333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            Select Area to Crop
            <Typography 
              variant="caption" 
              component="div" 
              sx={{ 
                color: '#666', 
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ 
                display: 'inline-block', 
                width: '12px', 
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                marginRight: '4px'
              }}></span>
              {/* Image captured with {rotation}° rotation applied */}
              Image captured with rotation applied
            </Typography>
          </div>

          {/* <FormControl sx={{width: '10rem'}}>
  <InputLabel id="demo-simple-select-label">Select Side</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    // size='small'
    value={selectedSide}
    label="side"
    onChange={(e) => setSelectedSide(e.target.value)}
  >
    <MenuItem value={'LH'}>Left</MenuItem>
    <MenuItem value={'RH'}>Right</MenuItem>
  </Select>
</FormControl> */}

<FormControl sx={{ width: '13rem' }} error={selectedSide === ''}>
  <InputLabel id="demo-simple-select-label">Select Side</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={selectedSide}
    label="Select Side"
    size='small'
    onChange={(e) => setSelectedSide(e.target.value)}
  >
    <MenuItem value={'LH'}>Left</MenuItem>
    <MenuItem value={'RH'}>Right</MenuItem>
  </Select>
  {selectedSide === '' && (
    <Typography variant="caption" color="error">
      Please select a side (LH or RH).
    </Typography>
  )}
</FormControl>

{/* <FormControl required sx={{  width: '100%'}} >
            <InputLabel id="camera-label">Filter</InputLabel>
            <Select
             size='small'
              labelId="camera-label"
              id="Filter"
              // value={filter}
              label="Filter"
              // onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value={'hour'}>Sort By Hour</MenuItem>
              <MenuItem value={'day'}>Sort By Day</MenuItem>
              <MenuItem value={'month'}>Sort By Month</MenuItem>
              
              
            </Select>
          </FormControl> */}
          <IconButton
            aria-label="close"
            onClick={() => setShowCropModal(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              position: 'relative',
              // width: '100%',
              height: '450px',
              // backgroundColor: '#000',
              overflow: 'hidden',
              color: 'red'

            }}
          >
            {capturedImage && (
              <Cropper
                ref={cropperRef}
                src={`data:image/jpeg;base64,${capturedImage}`}
                // src={uploadedFileURL} 
                alt="Cropped Image"
                className="cropper"
                stencilProps={{
                  handlers: {
                    eastNorth: true,
                    north: true,
                    westNorth: true,
                    west: true,
                    westSouth: true,
                    south: true,
                    eastSouth: true,
                    east: true
                  },
                  lines: {
                    color: 'rgba(255, 255, 255, 0.5)',
                    width: 1,
                    grid: true
                  },
                  movable: true,
                  resizable: true
                }}
                backgroundProps={{
                  backgroundColor: 'black',
                  opacity: 0.7
                }}
                imageRestriction="stencil"
                onZoom={(e) => {
                  setZoom(e.zoom);
                }}
                defaultSize={{
                  width: 2500,
                  height: 2500
                }}
              />
              // <img src={uploadedFileURL} alt="" />
            )}

            {/* {uploadedFileURL} */}



          </div>
          
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: '#f5f5f5', 
            borderTop: '1px solid #e0e0e0'
          }}>            
            {/* <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.9rem' }}>
                Zoom:
              </Typography>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                style={{ 
                  flex: 1,
                  height: '6px',
                  background: '#ddd',
                  borderRadius: '3px',
                  outline: 'none',
                }}
              />
            </div> */}
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              alignItems: 'center'
            }}>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                <span>Resize from corners or edges, drag to position, then click "Apply Selection"</span>
              </div>
              <Button 
                variant="outlined" 
                size="small"
                onClick={resetCropper}
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#ccc',
                  color: '#666',
                  fontSize: '0.85rem',
                  '&:hover': {
                    borderColor: '#aaa',
                    backgroundColor: '#f9f9f9'
                  }
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>

        <DialogActions
          sx={{ 
            justifyContent: 'center', 
            padding: '12px 16px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}
        >
         <Button 
            variant="outlined"
            onClick={() => setShowCropModal(false)}
            sx={{ 
              mx: 1, 
              px: 3,
              textTransform: 'none',
              borderColor: '#f44336', // red border
              color: '#f44336',       // red text
              fontWeight: 500,
              '&:hover': {
                borderColor: '#d32f2f',           // darker red on hover
                backgroundColor: 'rgba(244,67,54,0.1)' // light red background on hover
              }
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={detectCirclesWithCroppedImage}
            sx={{ 
              mx: 1, 
              px: 3, 
              // backgroundColor: '#2196F3', // blue background
              backgroundColor: colors.primary,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                // backgroundColor: '#1976d2' // darker blue on hover
                backgroundColor: colors.buttonHover
              }
            }}
            // disabled={isLoading}
            loading={isLoading}
          >
            Apply Selection
          </Button>
        </DialogActions>
      </Dialog>

      {/* <DetectionAlert
        detectionAlert={detectionAlert}
        setDetectionAlert={setDetectionAlert}
        handleCloseDetectionAlert={() => setDetectionAlert(false)}
      /> */}

<Modal
      open={detectionAlert}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{width: '30rem', height: '30rem', bgcolor: 'pink'}}
      // className={classes.modal}
    >
      <Box>
        {/* <img src={progress} alt="" className={classes.image} /> */}
        <Typography variant="h6" gutterBottom>
          गिनती प्रक्रिया में है, कृपया प्रतीक्षा करें
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Detection process is running, please wait
        </Typography>
       
      </Box>
    </Modal>

{/* --------------reprocess if image is incorrect---------------- */}
    <Dialog
        open={isImgIncorrect}
        // open={true}
        // onClose={() => setIsImgIncorrect(false)}
        maxWidth={false}
        
        PaperProps={{
          style: {
            width: '80vw',
            maxWidth: '95vw',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100vh',
          }
        }}
      >
        <Box height={'10%'} p={'0.5rem 1rem'}>
          <Typography fontSize={'1.4rem'}>Total Brackets- {addedItem?.total_brackets_detected}</Typography>
          <Typography  fontSize={'1.4rem'}>Incorrect Brackets- {addedItem?.incorrect_brackets}</Typography>
          
        </Box>
        <Box bgcolor={'black'} width={'100%'} height={'80%'} sx={{overflow: 'auto'}}>
        <img style={{width: '100%'}} src={addedItem?.processed_url} alt="" />
{/* <Alert sx={{width: '28rem'}} severity="warning">Mismatched brackets found. Please fix and re-upload. </Alert> */}
        </Box>
        {/* <Typography margin={'auto'}>There is Mistake so Re-upload Image</Typography> */}
        <Box display={'flex'} alignItems={'center'} height={'8%'} justifyContent={'space-between'} width={'100%'} p={'0rem 1rem'} mt={'0.5rem'}>
        <Alert sx={{width: '28rem'}} severity="warning">Mismatched brackets found. Please fix and re-upload. </Alert>
        {/* <Alert sx={{width: '30rem', height: '100%'}} severity="warning" >
  <AlertTitle>Alert</AlertTitle>
  Mismatched brackets found. Please fix and re-upload.
</Alert> */}
        <Button 
                variant="contained" 
                // startIcon={<UploadIcon />}
                sx={{ 
                  // m: 1, 
                   width: '17rem',
                  // backgroundColor: '#4B8B3B',
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.buttonHover,
                    // backgroundColor: '#3A6F2F'
                  }
                }}
                onClick={deleteReport}
              >
                Re-upload Image
                
                {/* <label htmlFor="image-upload" style={{ cursor: 'pointer', margin: 'auto', width: '100%', height: '100%' }}>
                 Re-Upload Image
                </label>
                <input
                  id="image-upload"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ width: '10rem', display: 'none' }}
                  onChange={(e) => handleFileUpload(e, 'image')}
                /> */}
              </Button>
              </Box>

              {/* <Dialog
        open={true}
        // open={true}
        // onClose={() => setIsImgIncorrect(false)}
        maxWidth={false}
        
        PaperProps={{
          style: {
            width: '40vw',
            // maxWidth: '95vw',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '60vh',
          }
        }}
      ><FileUploadComponent /></Dialog> */}
      </Dialog>
      
     

    {/* <Dialog open={submitModalOpen} onClose={()=> setSubmitModalOpen(false)} >
        
        <DialogContent>
          
          <DialogContentText>
          Shipment data submitted successfully!
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setSubmitModalOpen(false)} color="primary">
            ok
          </Button>
        </DialogActions>
      </Dialog> */}

<Dialog
        open={submitModalOpen} 
        onClose={()=> setSubmitModalOpen(false)} 
        // open={true}
        // onClose={() => setIsImgIncorrect(false)}
        maxWidth={false}
        
        PaperProps={{
          style: {
            width: '80vw',
            maxWidth: '95vw',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100vh',
          }
        }}
      >
        <Box height={'10%'} p={'0.5rem 1rem'}>
          <Typography fontSize={'1.4rem'}>Total Brackets- {addedItem?.total_brackets_detected}</Typography>
          <Typography  fontSize={'1.4rem'}>Incorrect Brackets- {addedItem?.incorrect_brackets}</Typography>
          
        </Box>
        <Box bgcolor={'black'} width={'100%'} height={'80%'} sx={{overflow: 'auto'}}>
        <img style={{width: '100%'}} src={addedItem?.processed_url} alt="" />
{/* <Alert sx={{width: '28rem'}} severity="warning">Mismatched brackets found. Please fix and re-upload. </Alert> */}
        </Box>
        {/* <Typography margin={'auto'}>There is Mistake so Re-upload Image</Typography> */}
        <Box display={'flex'} alignItems={'center'} height={'8%'} justifyContent={'space-between'} width={'100%'} p={'0rem 1rem'} mt={'0.5rem'}>
        {/* <Alert sx={{width: '28rem'}} severity="warning">Mismatched brackets found. Please fix and re-upload. </Alert> */}
        <Alert severity="success">Brackets matched successfully.</Alert>
        {/* <Alert sx={{width: '30rem', height: '100%'}} severity="warning" >
  <AlertTitle>Alert</AlertTitle>
  Mismatched brackets found. Please fix and re-upload.
</Alert> */}
        <Button variant='contained' sx={{ 
                  // m: 1, 
                   width: '9rem',
                  // backgroundColor: '#4B8B3B',
                  backgroundColor: colors.primary,
                  '&:hover': {
                    backgroundColor: colors.buttonHover,
                    // backgroundColor: '#3A6F2F'
                  }
                }} onClick={()=> setSubmitModalOpen(false)}>Done</Button>
              </Box>

              {/* <Dialog
        open={true}
        // open={true}
        // onClose={() => setIsImgIncorrect(false)}
        maxWidth={false}
        
        PaperProps={{
          style: {
            width: '40vw',
            // maxWidth: '95vw',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '60vh',
          }
        }}
      ><FileUploadComponent /></Dialog> */}
      </Dialog>

      



    
</>

  )
}

export default BracketD