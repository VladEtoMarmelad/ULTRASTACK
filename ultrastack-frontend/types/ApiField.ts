// Define the structure for dynamic user inputs
export interface ApiField {
  key: string;          // The key name in the JSON body or placeholder in URL
  label: string;        // Label for the input field
  placeholder?: string;
  type?: string;        // input type (text, number, etc.)
  location: "body" | "url"; // Determines where the data goes
}
