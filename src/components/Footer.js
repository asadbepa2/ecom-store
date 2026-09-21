import { STORE_NAME } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-snow">
      <div className="container-x py-10 text-sm text-muted">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
