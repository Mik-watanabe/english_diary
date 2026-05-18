import { UserProvider } from "@/components/providers/UserProvider";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error);
    redirect("/login");
  }

  return <UserProvider initialUser={user}>{children}</UserProvider>;
}
