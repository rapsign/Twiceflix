import ActionButton from "../ActionButton";
import DataTable from "../Datatable";

const PlaylistsTable = ({ data, onEdit, onDelete, searchTerm }) => {
  const filteredData = data.filter((row) =>
    row.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: "Title",
      accessor: "title",
      cell: (row) => (
        <div>
          <div className="font-bold  mb-1">{row.title}</div>
          <div className="text-xs text-white/50 line-clamp-3">
            {row.description}
          </div>
        </div>
      ),
    },
    {
      header: "Number of Videos",
      accessor: "videoCount",
      sortable: true,
      cell: (row) => (
        <div className="text-center">
          <p>{row.videoCount ?? 0}</p>
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
};

export default PlaylistsTable;
