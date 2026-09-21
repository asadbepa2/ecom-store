import AdminShell from "@/components/AdminShell";

export const metadata = { title: "Admin", robots: { index: false } };

export default function PanelLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
