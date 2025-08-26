import { Metadata } from "next";
import PosterEditorContent from "./PosterEditorContent";

export const metadata: Metadata = {
  title: "Poster Editor",
  description: "Advanced poster design editor with professional tools",
  keywords: "poster, editor, design, canvas, tools",
};

export default function PosterEditorPage() {
  return <PosterEditorContent />;
}
