import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TableViewIcon from "@mui/icons-material/TableView";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BusinessIcon from "@mui/icons-material/Business"; // Added for Client Reports

export const sidebarReportsList = [
  // {
  //   id: 1,
  //   name: "Ideal Time Report",
  //   url: "ideal-time-report",
  // },
  // {
  //   id: 2,
  //   name: "CCTVs",
  //   url: "cctv",
  // },
  // {
  //   id: 3,
  //   name: "Item-wise Production Data",
  //   url: "item-wise-production-data",
  // },
  // { id: 4, name: "Machine Details Data", url: "machine-details-data" },
  { id: 5, name: "Pipe Reports", url: "pipe-reports" },
  // { id: 6, name: "Client Reports", url: "client-reports" },
  // { id: 6, name: "Machine-wise Utilisation", url: "machine-wise-utilisation" },
];

export const sidebarData = [
  { id: 1, icon: <HomeRoundedIcon />, name: "Dashboard", url: "dashboard" },
  {
    id: 2,
    icon: <AssessmentIcon />,
    name: "Reports",
    url: "pipe-reports",
  },
  {
    id: 3,
    icon: <BusinessIcon />, // Changed icon for Client Reports
    name: "Client Reports",
    url: "client-reports",
  },
  {
    id: 4,
    icon: <TaskAltIcon />,
    name: "SOP",
    url: "sop",
  },
  // {
  //   id: 4,
  //   icon: <TaskAltIcon />,
  //   name: "Upload SOP",
  //   url: "upload-sop",
  // },
];