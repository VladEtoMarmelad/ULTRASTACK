import { TechUI } from "../TechUI";

export const PostgresdbTech = () => (
  <>
    <TechUI.H3>Retrieve all records from the table</TechUI.H3>
    <TechUI.ApiData endpoint="http://localhost:3030/postgresdb" />

    <TechUI.H3>Create a new record</TechUI.H3>
    {/* Users can specify the column values via inputs, which are dynamically mapped to the SQL query */}
    <TechUI.ApiData 
      endpoint="http://localhost:3030/postgresdb" 
      config={{method: "post"}}
      fields={[
        { key: "name", label: "Item Name", placeholder: "Enter name...", location: "body" },
        { key: "description", label: "Description", placeholder: "Enter description...", location: "body" }
      ]}
    />
    
    <TechUI.H3>Find a single record by ID</TechUI.H3>
    {/* The :id placeholder is replaced by the 'id' field value in the URL path */}
    <TechUI.ApiData 
      endpoint="http://localhost:3030/postgresdb/:id" 
      fields={[
        { key: "id", label: "Record ID", placeholder: "1", location: "url" }
      ]}
    />

    <TechUI.H3>Update an existing record</TechUI.H3>
    <TechUI.ApiData 
      endpoint="http://localhost:3030/postgresdb/:id" 
      config={{
        method: "patch",
        data: { updatedAt: new Date().toISOString() }
      }}
      fields={[
        { key: "id", label: "Record ID", placeholder: "1", location: "url" },
        { key: "description", label: "New Description", placeholder: "Enter new description...", location: "body" }
      ]}
    />

    <TechUI.H3>Delete a record</TechUI.H3>
    <TechUI.ApiData 
      endpoint="http://localhost:3030/postgresdb/:id" 
      config={{ method: "delete" }} 
      fields={[
        { key: "id", label: "Record ID to Delete", placeholder: "1", location: "url" }
      ]}
    />
  </>
);