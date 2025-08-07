import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  FileText,
  Video,
  Award,
  ArrowLeft,
  Edit,
  Check,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const API_URL = `${import.meta.env.VITE_BACKEND_API}/get_trainee_info`;

const EmployeeDetails = () => {
  const { userId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [markingVideo, setMarkingVideo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVideo, setDialogVideo] = useState(null);
  const [l2DialogOpen, setL2DialogOpen] = useState(false);
  const [l2DialogVideo, setL2DialogVideo] = useState(null);
  const [markingL2Video, setMarkingL2Video] = useState(null);
  const [inductionLoading, setInductionLoading] = useState(false);
  const [inductionError, setInductionError] = useState(null);
  const [shopfloorLoading, setShopfloorLoading] = useState(false);
  const [shopfloorSuccess, setShopfloorSuccess] = useState(null);
  const [shopfloorError, setShopfloorError] = useState(null);
  const [l2Initializing, setL2Initializing] = useState(false);

  // Define tabs for navigation
  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'induction', label: 'Induction (L1)', icon: Video },
    { id: 'level2', label: 'Level 2', icon: Award },
  ];

  // Fetch employee details on mount
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?user_id=${userId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch employee details');
        const data = await response.json();
        const trainee = data.trainee || data;
        if (!trainee || !trainee.user_id) throw new Error('Employee not found');

        let avatar = '';
        const documents = trainee.user_info?.user_documents || {};

        if (documents.avatar && documents.avatar.length > 0) {
          const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
          avatar = image || documents.avatar[0];
        }

        setEmployee({
          ...trainee,
          avatar,
          fullName: trainee.user_info?.full_name || 'No Name',
          phone: trainee.user_info?.phone || 'N/A',
          email: trainee.user_info?.email || 'N/A',
          dob: trainee.user_info?.dob || 'N/A',
          gender: trainee.user_info?.gender || 'N/A',
          experience: trainee.user_info?.experience || 'N/A',
          designation: trainee.user_info?.designation || 'Trainee',
          department: trainee.user_info?.department || 'N/A',
          adhar: trainee.user_info?.adhar_number || 'N/A',
        });
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchEmployeeDetails();
    }
  }, [userId, token]);

  // Handle file upload for forms
  const handleFileUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('upload_file', file);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/upload_induction_form?user_id=${employee.user_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();
      setUploadSuccess(data.message || 'File uploaded successfully!');

      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const newData = await refreshed.json();
      const trainee = newData.trainee || newData;
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Initialize HR induction program
  const initializeInduction = async () => {
    setInductionLoading(true);
    setInductionError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/initialize_induction?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to initialize induction');

      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const data = await refreshed.json();
      const trainee = data.trainee || data;
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
    } catch (err) {
      setInductionError(err.message);
    } finally {
      setInductionLoading(false);
    }
  };

  // Initialize Level 2 training
  const initializeL2 = async () => {
    setL2Initializing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/initialize_multilevel_l2?user_id=${employee.user_id}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to initialize Level 2');

      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const data = await refreshed.json();
      const trainee = data.trainee || data;
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
    } catch (err) {
      setUploadError(err.message || 'Failed to initialize Level 2');
    } finally {
      setL2Initializing(false);
    }
  };

  // Mark shopfloor training as completed
  const handleShopfloorComplete = async () => {
    setShopfloorLoading(true);
    setShopfloorError(null);
    setShopfloorSuccess(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/mark_shopfloor_training_completed?user_id=${
          employee.user_id
        }`,
        {
          method: 'PUT',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to mark shopfloor training as completed');

      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const data = await refreshed.json();
      const trainee = data.trainee || data;
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
      setShopfloorSuccess('Shopfloor training marked as completed');
    } catch (err) {
      setShopfloorError(err.message || 'Failed to mark shopfloor training as completed');
    } finally {
      setShopfloorLoading(false);
    }
  };

  // Handle video marking confirmation
  const handleDialogClose = async (confirmed) => {
    setDialogOpen(false);
    if (confirmed && dialogVideo) {
      setMarkingVideo(dialogVideo.title);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/mark_video_watched`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: employee.user_id,
            video_title: dialogVideo.title,
          }),
        });
        if (!response.ok) throw new Error('Failed to mark video as watched');
        setEmployee((prev) => ({
          ...prev,
          induction: {
            ...prev.induction,
            videos: prev.induction.videos.map((v) =>
              v.title === dialogVideo.title
                ? {
                    ...v,
                    status: 'Watched',
                    watched_at: new Date().toISOString(),
                  }
                : v
            ),
          },
        }));
      } catch (err) {
        setUploadError(err.message || 'Failed to mark video as watched');
      } finally {
        setMarkingVideo(null);
        setDialogVideo(null);
      }
    } else {
      setDialogVideo(null);
    }
  };

  // Handle Level 2 video marking confirmation
  const handleL2DialogClose = async (confirmed) => {
    setL2DialogOpen(false);
    if (confirmed && l2DialogVideo) {
      setMarkingL2Video(l2DialogVideo.title);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/mark_multilevel_l2_video_watched`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: employee.user_id,
              video_title: l2DialogVideo.title,
            }),
          }
        );
        if (!response.ok) throw new Error('Failed to mark Level 2 video as watched');
        setEmployee((prev) => ({
          ...prev,
          multilevel_l2: {
            ...prev.multilevel_l2,
            videos: prev.multilevel_l2.videos.map((v) =>
              v.title === l2DialogVideo.title
                ? {
                    ...v,
                    status: 'Watched',
                    watched_at: new Date().toISOString(),
                  }
                : v
            ),
          },
        }));
      } catch (err) {
        setUploadError(err.message || 'Failed to mark Level 2 video as watched');
      } finally {
        setMarkingL2Video(null);
        setL2DialogVideo(null);
      }
    } else {
      setL2DialogVideo(null);
    }
  };

  // Handle L2 form upload
  const handleL2FormUpload = async (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('upload_file', file);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/upload_multilevel_l2_form?user_id=${employee.user_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();
      setUploadSuccess(data.message || 'File uploaded successfully!');

      // Refresh employee data
      const refreshed = await fetch(`${API_URL}?user_id=${employee.user_id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!refreshed.ok) throw new Error('Failed to refresh employee data');
      const newData = await refreshed.json();
      const trainee = newData.trainee || newData;
      let avatar = '';
      const documents = trainee.user_info?.user_documents || {};
      if (documents.avatar && documents.avatar.length > 0) {
        const image = documents.avatar.find((url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url));
        avatar = image || documents.avatar[0];
      }
      setEmployee({
        ...trainee,
        avatar,
        fullName: trainee.user_info?.full_name || 'No Name',
        phone: trainee.user_info?.phone || 'N/A',
        email: trainee.user_info?.email || 'N/A',
        dob: trainee.user_info?.dob || 'N/A',
        gender: trainee.user_info?.gender || 'N/A',
        experience: trainee.user_info?.experience || 'N/A',
        designation: trainee.user_info?.designation || 'Trainee',
        department: trainee.user_info?.department || 'N/A',
        adhar: trainee.user_info?.adhar_number || 'N/A',
      });
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  // Render personal information tab
  const renderPersonalTab = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Personal Data</h3>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Edit size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Name</label>
          <p className="font-medium text-gray-900">{employee?.fullName}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Nationality</label>
          <p className="font-medium text-gray-900">Brazilian</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Birthdate</label>
          <p className="font-medium text-gray-900">
            {employee?.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Gender</label>
          <p className="font-medium text-gray-900">{employee?.gender}</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Marital Status</label>
          <p className="font-medium text-gray-900">Single</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Skin Color</label>
          <p className="font-medium text-gray-900">White</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">Mother's Name</label>
          <p className="font-medium text-gray-900">Maria Aparecida</p>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide">State</label>
          <p className="font-medium text-gray-900">São Paulo</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Contact</h4>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Edit size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
            <p className="font-medium text-gray-900">{employee?.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Neighborhood</label>
            <p className="font-medium text-gray-900">Bela Vista</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">CEP</label>
            <p className="font-medium text-gray-900">02965 030</p>
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-wide">Address</label>
            <p className="font-medium text-gray-900">
              APT 123 Edificio Chico da Vila N 400, São Paulo
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render documents tab
  const renderDocumentsTab = () => (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">ID Proof Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Aadhaar</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.id_proof?.aadhaar?.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`aadhaar ${idx + 1}`}
                  className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Pan Card</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.id_proof?.pan_card?.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`pan_card ${idx + 1}`}
                  className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Voter Id</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.id_proof?.voter_id?.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`voter_id ${idx + 1}`}
                  className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">Education Certificates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Tenth</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.education_certificates?.tenth?.map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={url}
                  alt={`tenth ${idx + 1}`}
                  className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Twelfth</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.education_certificates?.twelfth?.map(
              (url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`twelfth ${idx + 1}`}
                    className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                  />
                </a>
              )
            )}
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Diploma</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.education_certificates?.diploma?.map(
              (url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`diploma ${idx + 1}`}
                    className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                  />
                </a>
              )
            )}
          </div>
        </div>
        <div className="border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold mb-2">Degree</h4>
          <div className="flex flex-wrap gap-2">
            {employee?.user_info?.user_documents?.education_certificates?.degree?.map(
              (url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={url}
                    alt={`degree ${idx + 1}`}
                    className="w-24 h-20 object-cover border border-gray-200 rounded-md"
                  />
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render HR induction tab
  const renderInductionTab = () => {
    if (!employee?.induction) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">HR Induction Program (L1)</h3>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Not Started
            </span>
          </div>

          {inductionError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{inductionError}</div>
          )}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={initializeInduction}
            disabled={inductionLoading}
          >
            {inductionLoading ? 'Initializing...' : 'Initialize Induction'}
          </button>
        </div>
      );
    }

    const { induction } = employee;
    const allVideosWatched = induction.videos?.every((v) => v.status === 'Watched');

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">HR Induction Program (L1)</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              induction.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {induction.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>

        {allVideosWatched && induction.completed_at && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
            All videos completed! Induction completed at:{' '}
            {new Date(induction.completed_at).toLocaleString()}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Video size={16} className="mr-2" />
            Training Videos
          </h4>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Watched At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {induction.videos?.map((video, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {video.link ? (
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {video.title}
                        </a>
                      ) : (
                        video.title
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {video.status === 'Watched' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <Check size={12} className="mr-1" />
                          Watched
                        </span>
                      ) : (
                        <button
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => {
                            setDialogVideo(video);
                            setDialogOpen(true);
                          }}
                          disabled={markingVideo === video.title}
                        >
                          <Eye size={14} className="mr-1" />
                          Mark as Watched
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {video.watched_at
                        ? new Date(video.watched_at).toLocaleDateString()
                        : 'Not watched'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">HR Induction (L1) Evaluation Test</h4>
            {uploadError && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
                {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="mb-2 p-2 bg-green-100 text-green-700 text-sm rounded-md">
                {uploadSuccess}
              </div>
            )}
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer inline-block">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              />
              {uploading ? 'Uploading...' : 'Upload File'}
            </label>

            {Array.isArray(induction.form_files) && induction.form_files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-blue-900 mb-2">Uploaded Induction Forms</h4>
                <ul className="list-disc ml-6">
                  {induction.form_files.map((file, idx) => (
                    <li key={idx}>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline text-sm"
                      >
                        {file.split('/').pop()}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Level 2 training tab
  const renderLevel2Tab = () => {
    if (!employee?.multilevel_l2) {
      return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Level 2</h3>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
              Not Started
            </span>
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={initializeL2}
            disabled={l2Initializing}
          >
            {l2Initializing ? 'Initializing...' : 'Initialize Level 2'}
          </button>
        </div>
      );
    }

    const l2 = employee.multilevel_l2;
    const allVideosWatched = l2.videos?.every((v) => v.status === 'Watched');
    const shopfloorCompleted = l2.shopfloor_training === true;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Level 2</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              l2.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {l2.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>

        {allVideosWatched && l2.completed_at && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md font-medium">
            All videos completed! Level 2 completed at: {new Date(l2.completed_at).toLocaleString()}
          </div>
        )}

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Video size={16} className="mr-2" />
            Training Videos
          </h4>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Watched At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {l2.videos?.map((video, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {video.link ? (
                        <a
                          href={video.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {video.title}
                        </a>
                      ) : (
                        video.title
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {video.status === 'Watched' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <Check size={12} className="mr-1" />
                          Watched
                        </span>
                      ) : (
                        <button
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => {
                            setL2DialogVideo(video);
                            setL2DialogOpen(true);
                          }}
                          disabled={markingL2Video === video.title}
                        >
                          <Eye size={14} className="mr-1" />
                          Mark as Watched
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {video.watched_at
                        ? new Date(video.watched_at).toLocaleDateString()
                        : 'Not watched'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {allVideosWatched && (
            <>
              <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Shopfloor Training</h4>
                {shopfloorError && (
                  <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
                    {shopfloorError}
                  </div>
                )}
                {shopfloorSuccess && (
                  <div className="mb-2 p-2 bg-green-100 text-green-700 text-sm rounded-md">
                    {shopfloorSuccess}
                  </div>
                )}
                {shopfloorCompleted ? (
                  <div className="text-green-700 font-medium mb-2">
                    Shopfloor Training Completed
                  </div>
                ) : (
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={handleShopfloorComplete}
                    disabled={shopfloorLoading}
                  >
                    {shopfloorLoading ? 'Marking...' : 'Mark Shopfloor Training as Completed'}
                  </button>
                )}
              </div>
              {shopfloorCompleted && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Shopfloor Training Form Upload</h4>
                  {uploadError && (
                    <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
                      {uploadError}
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="mb-2 p-2 bg-green-100 text-green-700 text-sm rounded-md">
                      {uploadSuccess}
                    </div>
                  )}
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer inline-block mr-4">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleL2FormUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                    />
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </label>
                  
                  {Array.isArray(l2.form_files) && l2.form_files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-blue-900 mb-2">Uploaded Level 2 Forms</h4>
                      <ul className="list-disc ml-6">
                        {l2.form_files.map((file, idx) => (
                          <li key={idx}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-700 underline text-sm"
                            >
                              {file.split('/').pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalTab();
      case 'documents':
        return renderDocumentsTab();
      case 'induction':
        return renderInductionTab();
      case 'level2':
        return renderLevel2Tab();
      default:
        return null;
    }
  };

  // Confirmation dialog component
  const SimpleDialog = ({ open, onClose, video }) => {
    if (!open) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark video as watched?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to mark <b>{video?.title}</b> as watched?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => onClose(true)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-medium text-gray-900 mb-2">Employee not found</div>
          <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Employee List
        </button>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Basic Details */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="text-center mb-6">
                {employee?.avatar ? (
                  /\.(jpg|jpeg|png|gif|webp)$/i.test(employee.avatar) ? (
                    <a href={employee.avatar} target="_blank" rel="noopener noreferrer">
                      <img
                        src={employee.avatar}
                        alt={employee.fullName}
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 object-cover"
                      />
                    </a>
                  ) : (
                    <a href={employee.avatar} target="_blank" rel="noopener noreferrer">
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 bg-blue-100 flex items-center justify-center">
                        <span className="text-4xl text-blue-600 font-bold">
                          {employee?.fullName?.charAt(0) || ''}
                        </span>
                      </div>
                    </a>
                  )
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500 bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl text-blue-600 font-bold">
                      {employee?.fullName?.charAt(0) || ''}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{employee?.fullName}</h2>
                <p className="text-blue-600 font-medium">{employee?.designation}</p>
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold">Employee ID:</span> {employee?.user_id}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <User size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Number</p>
                    <p className="font-medium text-gray-900">SXB</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Building size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="font-medium text-gray-900">00532</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Admission Date</p>
                    <p className="font-medium text-gray-900">10/05/2019</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Briefcase size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Manager</p>
                    <p className="font-medium text-gray-900">Anakin Skywalker</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <GraduationCap size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Function</p>
                    <p className="font-medium text-gray-900">Analista II</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Building size={16} className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">T.I.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 lg:col-span-9">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} className="mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">{renderContent()}</div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SimpleDialog open={dialogOpen} onClose={handleDialogClose} video={dialogVideo} />
      <SimpleDialog open={l2DialogOpen} onClose={handleL2DialogClose} video={l2DialogVideo} />
    </div>
  );
};

export default EmployeeDetails;
