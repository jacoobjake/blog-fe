import { ResetPasswordForm } from "@/components/forms/auth";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { email = "", token = "" } = await searchParams;

  if (!email || !token) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-2/3 md:w-2/5 max-w-md p-12 rounded-4xl bg-background-secondary space-y-4 text-center">
          <p className="font-bold">Invalid reset link</p>
          <p className="text-sm text-muted">
            This password reset link is missing required information. Request a new
            link from the forgot password page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <ResetPasswordForm email={email} token={token} />
    </div>
  );
}
