import { TechUI } from "../TechUI";

export const AuthTech = () => (
  <>
    <TechUI.H1>Authentication & OAuth System</TechUI.H1>
    <TechUI.P>
      This section demonstrates identity management, including secure credential-based 
      registration and external provider integration.
    </TechUI.P>

    <TechUI.H3>User Registration (Local)</TechUI.H3>
    <TechUI.P>
      Registers a new user by hashing the password on the server side using bcrypt.
    </TechUI.P>
    {/* Interacts with the @Post('register') endpoint in AuthController */}
    <TechUI.ApiData
      endpoint="http://localhost:3030/auth/register"
      config={{ method: "post" }}
      fields={[
        { key: "email", label: "Email Address", placeholder: "user@example.com", location: "body" },
        { key: "name", label: "Full Name", placeholder: "John Doe", location: "body" },
        { key: "password", label: "Password", placeholder: "Enter secure password...", type: "password", location: "body" }
      ]}
    />

    <TechUI.H3>Google OAuth Flow</TechUI.H3>
    <TechUI.P>
      Initiates the Google login process. In a real browser environment, 
      this endpoint triggers a redirect to Google's consent screen.
    </TechUI.P>
    {/* Triggers the @Get('google') route which uses the Google Strategy */}
    <a 
      href="http://localhost:3030/auth/google" 
      className="px-4 py-2 bg-white border border-zinc-300 rounded-md inline-block"
    >
      Login with Google
    </a>

    <TechUI.H3>GitHub OAuth Flow</TechUI.H3>
    <TechUI.P>
      Connects to GitHub to retrieve user profile data and email.
    </TechUI.P>
    {/* Triggers the @Get('github') route for GitHub-based authentication */}
    <a 
      href="http://localhost:3030/auth/github" 
      className="px-4 py-2 bg-white border border-zinc-300 rounded-md inline-block"
    >
      Login with GitHub
    </a>
  </>
);