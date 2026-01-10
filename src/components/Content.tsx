import { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <main className="grow">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </main>
  );
}
