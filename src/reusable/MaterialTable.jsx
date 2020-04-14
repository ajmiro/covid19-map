import React from 'react';

const MaterialTable = ({ data, columns, title }) => {
    return (
        <div style={{ maxWidth: "100%" }}>
            <MaterialTable columns={columns} data={data} title={title} />
      </div>
    )
}

export default MaterialTable;