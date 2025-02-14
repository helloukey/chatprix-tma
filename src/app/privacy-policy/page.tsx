import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Chatprix - Privacy Policy",
  description: "Privacy Policy for Chatprix - Anonymous Global Chat",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                <p>
                  Welcome to Chatprix (&quot;we,&quot; &quot;our,&quot; or
                  &quot;us&quot;). This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you use our
                  Telegram mini app Chatprix (the &quot;App&quot;).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  2. Age Requirement
                </h2>
                <p>
                  Chatprix is intended for users who are 18 years of age or
                  older. By using this app, you confirm that you are at least 18
                  years old. If you are under 18, please do not use this app.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  3. Information We Collect
                </h2>
                <p>
                  We collect minimal information to provide and improve our
                  Service:
                </p>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Telegram User ID: To facilitate anonymous communication.
                  </li>
                  <li>
                    Chat messages: To enable communication between users. These
                    messages are stored for a minimal period and are deleted
                    once users exit the app.
                  </li>
                  <li>
                    Usage Data: Information on how the App is accessed and used.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  4. How We Use Your Information
                </h2>
                <p>We use the collected information for various purposes:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support</li>
                  <li>
                    To gather analysis or valuable information to improve our
                    Service
                  </li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  5. Data Retention
                </h2>
                <p>
                  We retain chat messages only for a minimal period while the
                  app is in use. Once a user exits the app, all associated
                  messages are permanently deleted from our servers. This
                  ensures that conversations remain temporary and enhances user
                  privacy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect the security of your personal information. However,
                  please be aware that no method of transmission over the
                  Internet or method of electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  7. Your Data Protection Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-2">
                  <li>Access the personal information we hold about you</li>
                  <li>
                    Request that we correct any personal information we hold
                    about you
                  </li>
                  <li>
                    Request that we delete any information we hold about you
                  </li>
                  <li>
                    Opt out of any marketing communications we may send you
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">
                  8. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date at
                  the top of this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p className="mt-2">Telegram: @chatprix</p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
