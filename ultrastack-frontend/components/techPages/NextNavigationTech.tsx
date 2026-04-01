import { TechUI } from "../index"

export const NextNavigationTech = () => (
  <>
    <TechUI.H3>You can test some Nextjs Navigation links here</TechUI.H3>
    <TechUI.P>
      Try switching to <TechUI.A href="/?tech=nextjs">another technology</TechUI.A> or check out the{" "}
      <TechUI.A href="/alternate">Next Navigation alter page</TechUI.A>.
    </TechUI.P>
  </>
);