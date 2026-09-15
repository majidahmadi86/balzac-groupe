import { notFound } from "next/navigation";

// Unknown /fr/* paths render the French 404 inside the French document.
export default function FrCatchAll() {
  notFound();
}
