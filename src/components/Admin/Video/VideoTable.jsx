import moment from "moment";
import DataTable from "../Datatable";
import ActionButton from "../ActionButton";

export default function VideoTable({ data, onEdit, onDelete, searchTerm }) {
  const filteredData = data.filter((row) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Video",
      accessor: "title",
      cell: (row) => (
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="shrink-0">
            <img
              src={row.thumbnail}
              alt={row.title}
              className="w-20 sm:w-24 md:w-28 aspect-video rounded-md object-cover"
            />
          </div>

          {/* Title / Description */}
          <div className="flex flex-col">
            <div className="font-bold mb-1 truncate max-w-50 md:max-w-75 lg:max-w-4xl">
              {row.title}
            </div>
            <div className="text-sm text-white/50 line-clamp-3 truncate max-w-50 md:max-w-75 lg:max-w-4xl">
              {row.description}
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Published At",
      accessor: "published_at",
      sortable: true,
      cell: (row) => (
        <div className="text-center">
          {row.published_at?.toDate
            ? moment(row.published_at.toDate()).format("DD MMM YYYY")
            : "-"}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      cell: (row) => (
        <div className="flex gap-2 items-center justify-center">
          <ActionButton type="edit" size="sm" onClick={() => onEdit(row)} />
          <ActionButton type="delete" size="sm" onClick={() => onDelete(row)} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      rowsPerPageOptions={[7, 10, 20]}
    />
  );
}
