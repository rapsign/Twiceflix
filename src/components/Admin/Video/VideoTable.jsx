import DataTable from "react-data-table-component";
import moment from "moment";
import VideoActionButtons from "./VideoActionButton";
import { useIsMobile } from "../../../hooks/useIsMobile";

const VideoTable = ({ data, onEdit, onDelete, searchTerm }) => {
  const filteredData = data.filter((row) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const isMobile = useIsMobile();

  const columns = [
    {
      name: "Thumbnail",
      selector: (row) => row.thumbnail,
      cell: (row) => (
        <img
          src={row.thumbnail}
          alt="Thumb"
          style={{
            width: "120px",
            minWidth: "120px",
            maxWidth: "120px",
            borderRadius: "8px",
          }}
        />
      ),
      width: "130px",
    },
    {
      name: "",
      selector: (row) => row.title,
      cell: (row) => (
        <div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "2px",
              color: "#0f0f0f",
            }}
          >
            {row.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#3f3f3f",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {row.description}
          </div>
        </div>
      ),
      width: isMobile ? "350px" : "30%",
    },
    {
      name: "Published At",
      cell: (row) => moment(row.published_at.toDate()).format("DD MMM YYYY"),
      width: isMobile ? "150px" : "35%",
    },
    {
      name: "Action",
      cell: (row) => (
        <VideoActionButtons row={row} onEdit={onEdit} onDelete={onDelete} />
      ),
      width: isMobile ? "100px" : "35%",
    },
  ];

  const customStyles = {
    tableWrapper: {
      style: {
        borderTopRadius: "1rem",
        overflow: "hidden",
      },
    },
    rows: {
      style: {
        minHeight: "52px",
        borderBottom: "5px solid #fff",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#fff",
        color: "#0f0f0f",
        fontSize: "14px",
        fontWeight: "semibold",
      },
    },
    cells: {
      style: {
        backgroundColor: "#fff",
        padding: "10px",
        color: "#0f0f0f",
        fontSize: "14px",
        fontWeight: "semibold",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #3f3f3f",
        marginTop: "-10px",
        backgroundColor: "#fff",
        color: "#0f0f0f",
        borderRadius: "0 0 1rem 1rem",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      pagination
      responsive
      customStyles={customStyles}
      style={{ width: "100%" }}
    />
  );
};

export default VideoTable;
