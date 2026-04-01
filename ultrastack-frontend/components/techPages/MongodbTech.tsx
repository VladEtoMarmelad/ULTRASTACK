import { TechUI } from "../TechUI";

export const MongodbTech = () => (
  <>
    <TechUI.H3>Retrieve all documents from the collection</TechUI.H3>
    <TechUI.ApiData endpoint="http://localhost:3030/mongodb" />

    <TechUI.H3>Create a new document</TechUI.H3>
    {/* Users can now specify the name and description via inputs */}
    <TechUI.ApiData 
      endpoint="http://localhost:3030/mongodb" 
      config={{method: "post"}}
      fields={[
        { key: "name", label: "Item Name", placeholder: "Enter name...", location: "body" },
        { key: "description", label: "Description", placeholder: "Enter description...", location: "body" }
      ]}
    />
    
    <TechUI.H3>Find a single document by ID</TechUI.H3>
    {/* The :id placeholder is replaced by the 'id' field value */}
    <TechUI.ApiData 
      endpoint="http://localhost:3030/mongodb/:id" 
      fields={[
        { key: "id", label: "Document ID", placeholder: "65f8c3...", location: "url" }
      ]}
    />

    <TechUI.H3>Update an existing document</TechUI.H3>
    <TechUI.ApiData 
      endpoint="http://localhost:3030/mongodb/:id" 
      config={{
        method: "patch",
        data: { lastModified: new Date().toISOString() }
      }}
      fields={[
        { key: "id", label: "Document ID", placeholder: "65f8c3...", location: "url" },
        { key: "description", label: "New Description", placeholder: "Enter new description...", location: "body" }
      ]}
    />

    <TechUI.H3>Delete a document</TechUI.H3>
    <TechUI.ApiData 
      endpoint="http://localhost:3030/mongodb/:id" 
      config={{ method: "delete" }} 
      fields={[
        { key: "id", label: "Document ID to Delete", placeholder: "65f8c3...", location: "url" }
      ]}
    />
  </>
);