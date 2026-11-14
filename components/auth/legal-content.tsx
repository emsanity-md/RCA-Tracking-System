import type { ReactNode } from "react";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 border-t border-border pt-5 first:mt-0 first:border-t-0 first:pt-0">
      <h3 className="font-heading text-[0.95rem] font-semibold text-foreground">
        {title}
      </h3>
      <div className="mt-2 space-y-2.5 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Summary({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3.5 py-3">
      <p className="text-[0.7rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        In short
      </p>
      <p className="mt-1.5 text-sm leading-6 text-foreground/85">{children}</p>
    </div>
  );
}

export function TermsContent() {
  return (
    <div>
      <Summary>
        RCA Tracking System is a demonstration workspace. Use it to explore the
        incident workflow, but do not rely on it as a production record system
        or enter real confidential information.
      </Summary>

      <Section title="1. Agreement to these terms">
        <p>
          These Terms &amp; Conditions govern your access to and use of the RCA
          Tracking System prototype, including the landing page, account forms,
          dashboard, and documentation. By creating an account or continuing to
          use the workspace, you accept these terms. If you do not agree, do not
          use the service.
        </p>
      </Section>

      <Section title="2. What this service is">
        <p>
          The service is a front-end demonstration of an incident and root cause
          analysis workflow. It is intended for evaluation, training, and design
          review. It is not a certified records system, a compliance tool, or a
          substitute for your organization&apos;s own incident, safety, security,
          or legal processes.
        </p>
        <p>
          Features may be added, changed, or removed without notice while the
          prototype is being developed. Descriptions in the documentation explain
          the current behaviour, not a guaranteed future roadmap.
        </p>
      </Section>

      <Section title="3. Accounts and eligibility">
        <p>
          You must be at least 13 years old to create an account. The date of
          birth you provide is used only to check that requirement. Accounts in
          this prototype are not connected to a real identity service and are not
          persisted after you leave the page.
        </p>
        <p>
          Do not reuse a password from another service. Because this is a
          prototype, any non-empty email or username and password can open the
          dashboard; no credential is verified against a backend.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>
          You agree to use the service lawfully and only for its intended
          demonstration purpose. You must not attempt to disrupt the service,
          interfere with another person&apos;s use, probe for vulnerabilities, or
          access data you are not authorized to see.
        </p>
        <p>
          Do not enter customer data, personal data about other people, regulated
          information, credentials, or confidential business records. The
          workspace is not designed or secured for that kind of information.
        </p>
      </Section>

      <Section title="5. Content you enter">
        <p>
          You are responsible for the accuracy and appropriateness of the
          incident descriptions, evidence, causes, and actions you enter. The
          service does not verify those statements and does not decide whether an
          incident is reportable under any law or policy.
        </p>
        <p>
          You retain responsibility for your content. Because the prototype does
          not persist records, you should keep your own authoritative copy of any
          information you need to retain.
        </p>
      </Section>

      <Section title="6. Availability and changes">
        <p>
          The service is provided on an as-is and as-available basis. There is no
          service-level commitment, backup, or guarantee of uninterrupted access.
          Maintenance, deployment, or a browser refresh may clear the current
          session and any records entered into it.
        </p>
      </Section>

      <Section title="7. Disclaimers">
        <p>
          To the extent permitted by law, the service is provided without
          warranties of any kind, whether express or implied, including fitness
          for a particular purpose, accuracy, and non-infringement. Nothing in
          the workspace constitutes legal, safety, security, or professional
          advice.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          To the extent permitted by law, the project maintainers are not liable
          for indirect, incidental, special, or consequential losses arising from
          use of the prototype, including lost records, lost time, or decisions
          made from demonstration data.
        </p>
      </Section>

      <Section title="9. Changes to these terms">
        <p>
          These terms may be revised as the prototype evolves. The current version
          is always the one shown in this dialog. Continued use after a revision
          means you accept the updated terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these terms can be raised through the project&apos;s
          GitHub repository. This notice describes a prototype and is not a
          substitute for legal review before a production launch.
        </p>
      </Section>
    </div>
  );
}

export function PrivacyContent() {
  return (
    <div>
      <Summary>
        Everything you enter stays in this browser tab for the current session.
        The prototype does not send account or incident data to a server and does
        not use analytics or advertising cookies.
      </Summary>

      <Section title="1. Scope of this notice">
        <p>
          This Privacy Policy explains what happens to information you enter on
          the landing page, the account forms, and the incident dashboard. It
          applies to this prototype only. A production deployment with a backend,
          authentication provider, or analytics would need a revised notice.
        </p>
      </Section>

      <Section title="2. Information the prototype handles">
        <p>
          The forms collect the details needed to demonstrate the account and
          incident workflow. The table below summarizes each category and what
          happens to it.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[32rem] border-collapse text-left text-xs">
            <thead className="bg-muted/40 text-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Information</th>
                <th scope="col" className="px-3 py-2 font-semibold">Why it is requested</th>
                <th scope="col" className="px-3 py-2 font-semibold">What happens to it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground">
              <tr>
                <td className="px-3 py-2">Email and username</td>
                <td className="px-3 py-2">To demonstrate signing in and identifying a session</td>
                <td className="px-3 py-2">Kept in page memory only; not sent or stored</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Date of birth</td>
                <td className="px-3 py-2">To calculate age and enforce the 13+ requirement</td>
                <td className="px-3 py-2">Used for validation; not retained after leaving</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Password and confirmation</td>
                <td className="px-3 py-2">To demonstrate password entry and matching rules</td>
                <td className="px-3 py-2">Held briefly in form state; never saved or checked</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Incident records</td>
                <td className="px-3 py-2">To populate the dashboard, tables, and charts</td>
                <td className="px-3 py-2">Held in React state until the page is refreshed or closed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You control what you type. Please do not enter real personal,
          confidential, or regulated information anywhere in the prototype.
        </p>
      </Section>

      <Section title="3. How the information is used">
        <p>
          Information is used only to render the interface and validate the forms
          you are working with. For example, the date of birth is converted into
          an age so the signup form can reject someone under 13, and incident
          details are aggregated into the summary cards and charts.
        </p>
        <p>
          The prototype does not use the information for advertising, profiling,
          automated decision-making, or training a model. It does not send
          marketing email and does not attempt to verify your identity.
        </p>
      </Section>

      <Section title="4. Where the information lives">
        <p>
          Account fields and incident records live in the browser&apos;s memory
          while the page is open. The prototype does not write them to
          localStorage, sessionStorage, IndexedDB, or a cookie, and it does not
          transmit them to an application server.
        </p>
        <p>
          Refreshing the page, closing the tab, or navigating away clears the
          current session state. There is no account database from which a record
          could be recovered.
        </p>
      </Section>

      <Section title="5. Sharing and third parties">
        <p>
          The application does not share your form entries with third parties and
          does not include third-party analytics, advertising pixels, or social
          embeds. If the prototype is hosted publicly, the hosting provider may
          process standard request information such as an IP address and browser
          type in its own logs; that processing is outside the application code.
        </p>
      </Section>

      <Section title="6. Retention and your choices">
        <p>
          Because nothing is persisted, there is no stored account to delete and
          no retention period to manage. You can clear the session at any time by
          refreshing the page or closing the tab.
        </p>
        <p>
          You can also avoid entering information altogether and explore the
          documentation without creating an account. If you have questions about
          the handling described here, raise them through the project repository
          before entering anything sensitive.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          This is not a secured production system. There is no backend
          authentication, password hashing, access control, audit log, or
          encrypted record store. Treat the workspace as a public demonstration
          and never use it to hold real credentials or sensitive incident data.
        </p>
      </Section>

      <Section title="8. Children">
        <p>
          The account form requires users to be at least 13 years old. The
          prototype does not knowingly collect information from children under
          13. Because data is not persisted, a failed age check does not create a
          stored record.
        </p>
      </Section>

      <Section title="9. Changes and contact">
        <p>
          This notice may be updated when the prototype&apos;s data handling
          changes. The version shown in this dialog is the current one. Questions
          can be raised through the project&apos;s GitHub repository. This notice
          is informational and should be reviewed by a qualified professional
          before a production launch.
        </p>
      </Section>
    </div>
  );
}
